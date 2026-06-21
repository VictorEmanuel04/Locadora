import type { Request, Response } from "express";
import { MovieAvailability, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export async function listMovies(request: Request, response: Response) {
  const { search, genre, available } = request.query;

  const where: Prisma.MovieWhereInput = {
    ...(genre ? { genre: String(genre) } : {}),
    ...(available === "true" ? { availability: MovieAvailability.AVAILABLE, stock: { gt: 0 } } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: String(search), mode: "insensitive" } },
            { synopsis: { contains: String(search), mode: "insensitive" } }
          ]
        }
      : {})
  };

  const movies = await prisma.movie.findMany({
    where,
    orderBy: { title: "asc" },
    include: {
      _count: {
        select: { reviews: true, rentals: true }
      }
    }
  });

  return response.json({ data: movies });
}

export async function getMovieById(request: Request, response: Response) {
  const movieId = String(request.params.id);

  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: {
      reviews: {
        include: {
          user: {
            select: { id: true, name: true }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!movie) {
    return response.status(404).json({ error: "Filme nao encontrado." });
  }

  return response.json({ data: movie });
}
