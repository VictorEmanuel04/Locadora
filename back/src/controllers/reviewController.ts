import type { Request, Response } from "express";
import { listMovieReviews, saveUserReview } from "../services/reviewService.js";
import { isServiceError } from "../services/serviceError.js";

export async function createOrUpdateReview(request: Request, response: Response) {
  const userId = request.user?.id;
  if (!userId) return response.status(401).json({ error: "Usuário não autenticado." });

  try {
    const review = await saveUserReview(userId, request.body);
    return response.status(200).json({ data: review });
  } catch (error) {
    if (
      isServiceError(error) &&
      ["REVIEW_DATA_REQUIRED", "INVALID_RATING"].includes(error.code)
    ) {
      return response.status(400).json({ error: error.message });
    }
    return response.status(500).json({ error: "Erro interno ao salvar a avaliação." });
  }
}

export async function getMovieReviews(request: Request, response: Response) {
  const movieId = String(request.params.movieId);

  try {
    const result = await listMovieReviews(movieId);
    return response.json({ data: result.reviews, meta: result.meta });
  } catch {
    return response.status(500).json({ error: "Erro ao buscar as avaliações do filme." });
  }
}
