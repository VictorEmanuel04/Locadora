import { MovieAvailability, RentalStatus } from "@prisma/client";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";

function buildExpirationDate() {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + env.rentalDurationDays)
    return expiresAt;
}

export async function processCheckout(userId: string, movieIds: string[]) {
    const movies = await prisma.movie.findMany({
        where: {
            id: { in: movieIds },
            availability: MovieAvailability.AVAILABLE,
            stock: { gt: 0 }
        }
    })

    if (movies.length !== movieIds.length) {
        throw new Error ("Filme indisponível!")
    }

    const rentals = await prisma.$transaction(
        movies.map((movie) => 
        prisma.rental.create({
            data: {
                userId,
                movieId: movie.id,
                expiresAt: buildExpirationDate(),
                pricePaid: movie.rentalPrice,
                status: RentalStatus.ACTIVE
            }
        }))
    )

    await prisma.cartItem.deleteMany({
        where: { userId, movieId: { in: movieIds } }
    })
    return rentals
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