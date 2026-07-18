import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function createOrUpdateReview(request: Request, response: Response) {
  const userId = request.user?.id;
  const { movieId, rating, comment } = request.body;

  if (!userId) return response.status(401).json({ error: "Usuário não autenticado." });
  if (!movieId || rating === undefined) {
    return response.status(400).json({ error: "Filme e nota (rating) são obrigatórios." });
  }

  // Validação simples de nota de 1 a 5
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return response.status(400).json({ error: "A nota deve ser entre 1 e 5." });
  }

  try {
    // Usamos 'upsert' porque um usuário só pode ter uma resenha por filme.
    // Se existir, atualiza. Se não, cria.
    const review = await prisma.review.upsert({
      where: {
        userId_movieId: { userId, movieId }
      },
      update: { rating, comment },
      create: { userId, movieId, rating, comment },
      include: { user: { select: { name: true } } } // Retorna o nome de quem avaliou
    });

    return response.status(200).json({ data: review });
  } catch {
    return response.status(500).json({ error: "Erro interno ao salvar a avaliação." });
  }
}

export async function getMovieReviews(request: Request, response: Response) {
  const movieId = String(request.params.movieId);

  try {
    const reviews = await prisma.review.findMany({
      where: { movieId },
      include: {
        user: { select: { id: true, name: true } } // Não retorna email/senha do usuário
      },
      orderBy: { createdAt: 'desc' }
    });

    // Opcional: Calcular a média das notas para enviar junto
    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    return response.json({ 
      data: reviews,
      meta: { averageRating, totalReviews: reviews.length }
    });
  } catch {
    return response.status(500).json({ error: "Erro ao buscar as avaliações do filme." });
  }
}
