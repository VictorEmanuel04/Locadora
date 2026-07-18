import type { Request, Response } from "express";
import { findRecommendationsForUser } from "../services/recommendationService.js";

export async function getRecommendations(request: Request, response: Response) {
  const userId = String(request.user?.id);

  try {
    const result = await findRecommendationsForUser(userId);
    return response.json({ data: result.movies, reason: result.reason });
  } catch {
    return response.status(500).json({ error: "Erro ao buscar recomendações." });
  }
}
