import { MovieAvailability, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

// Interface para tipar os filtros que vêm da query string
export interface MovieFilters {
  search?: string;
  genre?: string;
  available?: string;
  page: number;
  limit: number;
}

export async function fetchMovies(filters: MovieFilters) {
  const { search, genre, available, page, limit } = filters;

  // Cálculo de quantos registros pular com base na página atual
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

  // Promise.all executa as duas queries simultaneamente no banco para otimizar tempo de resposta
  const [movies, totalCount] = await Promise.all([
    prisma.movie.findMany({
      where,
      skip,        // Adicionado: Pula os itens das páginas anteriores
      take: limit, // Adicionado: Limita a quantidade de itens trazidos
      orderBy: { title: "asc" },
      include: {
        _count: {
          select: { reviews: true, rentals: true }
        }
      }
    }),
    prisma.movie.count({ where }) // Adicionado: Conta o total de registros que casam com o filtro
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  // Retorno modificado: Agora entrega os dados + metadados de paginação
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
            select: { id: true, name: true } // Protege os dados do usuário, trazendo apenas ID e Nome
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  return movie;
}