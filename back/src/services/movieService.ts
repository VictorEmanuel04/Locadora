import { MovieAvailability, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export interface MovieFilters {
  search?: string;
  genre?: string;
  available?: string;
  page: number;
  limit: number;
}

export async function fetchMovies(filters: MovieFilters) {
  const { search, genre, available, page, limit } = filters;

  const skip = (page - 1) * limit;

  // Montagem tipada das condições
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

  const [movies, totalCount] = await Promise.all([
    prisma.movie.findMany({
      where,
      skip,        
      take: limit, 
      orderBy: { title: "asc" },
      include: {
        _count: {
          select: { reviews: true, rentals: true }
        }
      }
    }),
    prisma.movie.count({ where }) 
  ]);

  const totalPages = Math.ceil(totalCount / limit);


  return {
    data: movies,
    meta: {
      totalItems: totalCount,
      totalPages,
      currentPage: page,
      itemsPerPage: limit
    }
  };
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