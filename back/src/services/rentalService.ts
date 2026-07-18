import { MovieAvailability, RentalStatus } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

function buildExpirationDate() {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + env.rentalDurationDays)
    return expiresAt;
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
        pricePaid: movie.rentalPrice.mul(100 - movie.discountPercentage).div(100),
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

  // Busca todas as locações do usuário
  const rentals = await prisma.rental.findMany({
    where: { userId },
    include: { movie: true },
    orderBy: { createdAt: "desc" }
  });

  // Retorna o objeto já separado em ativos e expirados
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
    throw new Error("NOT_FOUND"); // Lançamos um erro específico para o Controller tratar
  }
  if (previousRental.status === RentalStatus.ACTIVE && previousRental.expiresAt > new Date()) {
    throw new Error("NOT_EXPIRED");
  }

  const renewal = await prisma.rental.create({
    data: {
      userId: previousRental.userId,
      movieId: previousRental.movieId,
      pricePaid: previousRental.movie.rentalPrice,
      expiresAt: buildExpirationDate(),
      renewedFromId: previousRental.id
    }
  });

  return renewal;
}
