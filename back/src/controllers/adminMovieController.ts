import type { Request, Response } from "express";
import {
  createCatalogMovie,
  deleteCatalogMovie,
  deleteReviewByAdmin,
  updateCatalogMovie
} from "../services/adminService.js";
import { isServiceError } from "../services/serviceError.js";

export async function createMovie(request: Request, response: Response) {
  try {
    const movie = await createCatalogMovie(request.body);
    return response.status(201).json({ data: movie });
  } catch (error) {
    if (isServiceError(error) && error.code === "INVALID_MOVIE_DATA") {
      return response.status(400).json({ error: error.message });
    }
    throw error;
  }
}

export async function updateMovie(request: Request, response: Response) {
  try {
    const movie = await updateCatalogMovie(String(request.params.id), request.body);
    return response.json({ data: movie });
  } catch (error) {
    if (isServiceError(error) && error.code === "INVALID_MOVIE_DATA") {
      return response.status(400).json({ error: error.message });
    }
    throw error;
  }
}

export async function deleteMovie(request: Request, response: Response) {
  await deleteCatalogMovie(String(request.params.id));
  return response.status(204).send();
}

export async function deleteReview(request: Request, response: Response) {
  try {
    await deleteReviewByAdmin(String(request.params.id));
    return response.status(204).send();
  } catch (error) {
    if (isServiceError(error) && error.code === "REVIEW_NOT_FOUND") {
      return response.status(404).json({ error: error.message });
    }
    return response.status(500).json({ error: "Erro ao excluir avaliação." });
  }
}
