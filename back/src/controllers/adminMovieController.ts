import type { Request, Response } from "express";
import { MovieAvailability, type Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

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

function validateMovieInput(body: MovieInput, partial = false) {
  const data: Record<string, string | number | MovieAvailability | null> = {};
  const requiredText = ["title", "synopsis", "genre"] as const;
  for (const field of requiredText) {
    const value = body[field];
    if (!partial && (typeof value !== "string" || !value.trim())) {
      throw Object.assign(new Error(`${field} é obrigatório.`), { statusCode: 400 });
    }
    if (value !== undefined) {
      if (typeof value !== "string" || !value.trim()) throw Object.assign(new Error(`${field} inválido.`), { statusCode: 400 });
      data[field] = value.trim();
    }
  }

  for (const field of ["director", "ageRating", "posterUrl", "trailerUrl"] as const) {
    const value = body[field];
    if (value !== undefined) {
      if (value !== null && typeof value !== "string") throw Object.assign(new Error(`${field} inválido.`), { statusCode: 400 });
      data[field] = value === null ? null : value.trim();
    }
  }

  for (const field of ["releaseYear", "durationMinutes", "discountPercentage", "stock"] as const) {
    const value = body[field];
    if (value !== undefined) {
      const number = Number(value);
      if (!Number.isInteger(number) || number < 0 || (field === "discountPercentage" && number > 100)) {
        throw Object.assign(new Error(`${field} inválido.`), { statusCode: 400 });
      }
      data[field] = number;
    }
  }

  if (!partial && body.rentalPrice === undefined) throw Object.assign(new Error("rentalPrice é obrigatório."), { statusCode: 400 });
  if (body.rentalPrice !== undefined) {
    const price = Number(body.rentalPrice);
    if (!Number.isFinite(price) || price < 0) throw Object.assign(new Error("rentalPrice inválido."), { statusCode: 400 });
    data.rentalPrice = price;
  }

  if (body.availability !== undefined) {
    if (!Object.values(MovieAvailability).includes(body.availability as MovieAvailability)) {
      throw Object.assign(new Error("availability inválida."), { statusCode: 400 });
    }
    data.availability = body.availability as MovieAvailability;
  }
  return data;
}

export async function createMovie(request: Request, response: Response) {
  const movie = await prisma.movie.create({
    data: validateMovieInput(request.body) as unknown as Prisma.MovieCreateInput
  });

  return response.status(201).json({ data: movie });
}

export async function updateMovie(request: Request, response: Response) {
  const movieId = String(request.params.id);

  const movie = await prisma.movie.update({
    where: { id: movieId },
    data: validateMovieInput(request.body, true) as unknown as Prisma.MovieUpdateInput
  });

  return response.json({ data: movie });
}

export async function deleteMovie(request: Request, response: Response) {
  const movieId = String(request.params.id);

  await prisma.movie.delete({
    where: { id: movieId }
  });

  return response.status(204).send();
}
