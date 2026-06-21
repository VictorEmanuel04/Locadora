import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function createMovie(request: Request, response: Response) {
  const movie = await prisma.movie.create({
    data: request.body
  });

  return response.status(201).json({ data: movie });
}

export async function updateMovie(request: Request, response: Response) {
  const movieId = String(request.params.id);

  const movie = await prisma.movie.update({
    where: { id: movieId },
    data: request.body
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
