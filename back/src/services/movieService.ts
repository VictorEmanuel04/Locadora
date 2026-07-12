import { MovieAvailability, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

// Interface para tipar os filtros que vêm da query string
export interface MovieFilters {
  search?: string;
  genre?: string;
  available?: string;
}

export async function fetchMovies(filters: MovieFilters) {
  const { search, genre, available } = filters;

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

  return movies;
}

export async function fetchMovieById(movieId: string) {
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

  return movie;
}