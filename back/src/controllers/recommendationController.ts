import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getRecommendations(request: Request, response: Response) {
  const userId = String(request.user?.id);

  try {
    const userRentals = await prisma.rental.findMany({
      where: { userId },
      include: { movie: true }
    });

    // Se o usuário é novo e não tem locações, recomenda os filmes recém-adicionados
    if (userRentals.length === 0) {
      const fallbackMovies = await prisma.movie.findMany({
        where: { availability: 'AVAILABLE' },
        orderBy: { createdAt: 'desc' },
        take: 5
      });
      return response.json({ data: fallbackMovies, reason: "NEW_RELEASES" });
    }

    // Calcula qual o gênero mais frequente nas locações
    const genreCounts: Record<string, number> = {};
    for (const rental of userRentals) {
      const genre = rental.movie.genre;
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    }

    let favoriteGenre = "";
    let maxCount = 0;
    
    for (const [genre, count] of Object.entries(genreCounts)) {
      if (count > maxCount) {
        maxCount = count;
        favoriteGenre = genre;
      }
    }

    const rentedMovieIds = userRentals.map(r => r.movieId);

    // Busca filmes do gênero favorito, ignorando os que ele já alugou
    const recommendations = await prisma.movie.findMany({
      where: {
        genre: favoriteGenre,
        availability: 'AVAILABLE',
        id: { notIn: rentedMovieIds }
      },
      take: 5
    });

    return response.json({ data: recommendations, reason: `Porque você assiste muito ${favoriteGenre}` });
  } catch {
    return response.status(500).json({ error: "Erro ao buscar recomendações." });
  }
}
