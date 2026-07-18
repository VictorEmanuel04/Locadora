import { MovieAvailability, type Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { ServiceError } from "./serviceError.js";

type MovieInput = {
  title?: unknown;
  synopsis?: unknown;
  genre?: unknown;
  director?: unknown;
  releaseYear?: unknown;
  durationMinutes?: unknown;
  ageRating?: unknown;
  posterUrl?: unknown;
  trailerUrl?: unknown;
  rentalPrice?: unknown;
  discountPercentage?: unknown;
  availability?: unknown;
  stock?: unknown;
};

function invalidInput(message: string): never {
  throw new ServiceError("INVALID_MOVIE_DATA", message);
}

function validateMovieInput(body: MovieInput, partial = false) {
  const data: Record<string, string | number | MovieAvailability | null> = {};

  for (const field of ["title", "synopsis", "genre"] as const) {
    const value = body[field];
    if (!partial && (typeof value !== "string" || !value.trim())) {
      invalidInput(`${field} é obrigatório.`);
    }
    if (value !== undefined) {
      if (typeof value !== "string" || !value.trim()) invalidInput(`${field} inválido.`);
      data[field] = value.trim();
    }
  }

  for (const field of ["director", "ageRating", "posterUrl", "trailerUrl"] as const) {
    const value = body[field];
    if (value !== undefined) {
      if (value !== null && typeof value !== "string") invalidInput(`${field} inválido.`);
      data[field] = value === null ? null : value.trim();
    }
  }

  for (const field of ["releaseYear", "durationMinutes", "discountPercentage", "stock"] as const) {
    const value = body[field];
    if (value !== undefined) {
      const number = Number(value);
      if (
        !Number.isInteger(number) ||
        number < 0 ||
        (field === "discountPercentage" && number > 100)
      ) {
        invalidInput(`${field} inválido.`);
      }
      data[field] = number;
    }
  }

  if (!partial && body.rentalPrice === undefined) {
    invalidInput("rentalPrice é obrigatório.");
  }
  if (body.rentalPrice !== undefined) {
    const price = Number(body.rentalPrice);
    if (!Number.isFinite(price) || price < 0) invalidInput("rentalPrice inválido.");
    data.rentalPrice = price;
  }

  if (body.availability !== undefined) {
    if (!Object.values(MovieAvailability).includes(body.availability as MovieAvailability)) {
      invalidInput("availability inválida.");
    }
    data.availability = body.availability as MovieAvailability;
  }

  return data;
}

export function createCatalogMovie(input: MovieInput) {
  return prisma.movie.create({
    data: validateMovieInput(input) as unknown as Prisma.MovieCreateInput
  });
}

export function updateCatalogMovie(movieId: string, input: MovieInput) {
  return prisma.movie.update({
    where: { id: movieId },
    data: validateMovieInput(input, true) as unknown as Prisma.MovieUpdateInput
  });
}

export function deleteCatalogMovie(movieId: string) {
  return prisma.movie.delete({ where: { id: movieId } });
}

export async function deleteReviewByAdmin(reviewId: string) {
  const result = await prisma.review.deleteMany({ where: { id: reviewId } });
  if (result.count === 0) {
    throw new ServiceError("REVIEW_NOT_FOUND", "Avaliação não encontrada.");
  }
}
