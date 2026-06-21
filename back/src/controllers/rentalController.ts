import type { Request, Response } from "express";
import { MovieAvailability, RentalStatus } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

function buildExpirationDate() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.rentalDurationDays);
  return expiresAt;
}

export async function checkout(request: Request, response: Response) {
  const userId = request.user?.id;
  const { movieIds } = request.body as { movieIds: string[] };

  if (!userId || !Array.isArray(movieIds) || movieIds.length === 0) {
    return response.status(400).json({ error: "Informe ao menos um filme para locacao." });
  }

  const movies = await prisma.movie.findMany({
    where: {
      id: { in: movieIds },
      availability: MovieAvailability.AVAILABLE,
      stock: { gt: 0 }
    }
  });

  if (movies.length !== movieIds.length) {
    return response.status(400).json({ error: "Um ou mais filmes nao estao disponiveis." });
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
      })
    )
  );

  await prisma.cartItem.deleteMany({
    where: {
      userId,
      movieId: { in: movieIds }
    }
  });

  return response.status(201).json({ data: rentals });
}

export async function listMyRentals(request: Request, response: Response) {
  const userId = request.user?.id;
  const now = new Date();

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

  return response.json({
    data: {
      active: rentals.filter((rental) => rental.status === RentalStatus.ACTIVE && rental.expiresAt >= now),
      expired: rentals.filter((rental) => rental.status === RentalStatus.EXPIRED || rental.expiresAt < now)
    }
  });
}

export async function renewRental(request: Request, response: Response) {
  const userId = request.user?.id;
  const rentalId = String(request.params.id);

  const previousRental = await prisma.rental.findFirst({
    where: {
      id: rentalId,
      userId
    },
    include: { movie: true }
  });

  if (!previousRental) {
    return response.status(404).json({ error: "Locacao nao encontrada." });
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

  return response.status(201).json({ data: renewal });
}
