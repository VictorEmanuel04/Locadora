import { MovieAvailability, RentalStatus, type Prisma } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

function buildExpirationDate() {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + env.rentalDurationDays)
    return expiresAt;
}

function calculateRentalPrice(
  rentalPrice: Prisma.Decimal,
  discountPercentage?: number | null
) {
  const discount = Math.min(100, Math.max(0, discountPercentage ?? 0));

  if (discount === 0) {
    return rentalPrice;
  }

  return rentalPrice.minus(rentalPrice.mul(discount).div(100));
}

export async function processCheckout(userId: string, movieIds: string[]) {
  const uniqueMovieIds = [...new Set(movieIds)];
  if (uniqueMovieIds.length !== movieIds.length) {
    throw new Error("Não é permitido alugar o mesmo filme mais de uma vez no pedido.");
  }

  return prisma.$transaction(async (tx) => {
    const movies = await tx.movie.findMany({
      where: {
        id: { in: uniqueMovieIds },
        availability: MovieAvailability.AVAILABLE,
        stock: { gt: 0 }
      }
    });

    if (movies.length !== uniqueMovieIds.length) {
      throw new Error("Um ou mais filmes estão indisponíveis.");
    }

    for (const movie of movies) {
      const updated = await tx.movie.updateMany({
        where: { id: movie.id, stock: { gt: 0 }, availability: MovieAvailability.AVAILABLE },
        data: { stock: { decrement: 1 } }
      });
      if (updated.count !== 1) throw new Error("Um ou mais filmes ficaram indisponíveis.");
    }

    const rentals = await Promise.all(movies.map((movie) => tx.rental.create({
      data: {
        userId,
        movieId: movie.id,
        expiresAt: buildExpirationDate(),
        pricePaid: calculateRentalPrice(movie.rentalPrice, movie.discountPercentage),
        status: RentalStatus.ACTIVE
      }
    })));

    await tx.cartItem.deleteMany({ where: { userId, movieId: { in: uniqueMovieIds } } });
    return rentals;
  });
}


export async function listUserRentals(userId: string) {
  const now = new Date();

  // Atualiza os status expirados
  await prisma.rental.updateMany({
    where: {
      userId,
      status: RentalStatus.ACTIVE,
      expiresAt: { lt: now }
    },
    data: { status: RentalStatus.EXPIRED }
  });

  const rentals = await prisma.rental.findMany({
    where: { userId },
    include: { movie: true },
    orderBy: { createdAt: "desc" }
  });

  return {
    active: rentals.filter((rental) => rental.status === RentalStatus.ACTIVE && rental.expiresAt >= now),
    expired: rentals.filter((rental) => rental.status === RentalStatus.EXPIRED || rental.expiresAt < now)
  };
}

export async function processRenewal(userId: string, rentalId: string) {
  const previousRental = await prisma.rental.findFirst({
    where: {
      id: rentalId,
      userId
    },
    include: { movie: true }
  });

  if (!previousRental) {
    throw new Error("NOT_FOUND"); 
  }
  if (previousRental.status === RentalStatus.ACTIVE && previousRental.expiresAt > new Date()) {
    throw new Error("NOT_EXPIRED");
  }

  const renewal = await prisma.rental.create({
    data: {
      userId: previousRental.userId,
      movieId: previousRental.movieId,
      pricePaid: calculateRentalPrice(
        previousRental.movie.rentalPrice,
        previousRental.movie.discountPercentage
      ),
      expiresAt: buildExpirationDate(),
      renewedFromId: previousRental.id
    }
  });

  return renewal;
}
