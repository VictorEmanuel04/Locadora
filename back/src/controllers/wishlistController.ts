import type { Request, Response } from "express";
import { isServiceError } from "../services/serviceError.js";
import {
  addMovieToWishlist,
  listWishlistItems,
  removeMovieFromWishlist
} from "../services/wishlistService.js";

export async function addToWishlist(request: Request, response: Response) {
  const userId = request.user?.id;
  const { movieId } = request.body;

  if (!userId) return response.status(401).json({ error: "Usuário não autenticado." });
  if (!movieId) return response.status(400).json({ error: "O ID do filme é obrigatório." });

  try {
    const wishlistItem = await addMovieToWishlist(userId, movieId);
    return response.status(201).json({ data: wishlistItem });
  } catch (error) {
    if (isServiceError(error) && error.code === "WISHLIST_ITEM_EXISTS") {
      return response.status(409).json({ error: error.message });
    }
    return response.status(500).json({ error: "Erro interno ao adicionar à wishlist." });
  }
}

export async function getMyWishlist(request: Request, response: Response) {
  const userId = request.user?.id;
  if (!userId) return response.status(401).json({ error: "Usuário não autenticado." });

  try {
    const wishlist = await listWishlistItems(userId);
    return response.json({ data: wishlist });
  } catch {
    return response.status(500).json({ error: "Erro ao buscar lista de desejos." });
  }
}

export async function removeFromWishlist(request: Request, response: Response) {
  const userId = request.user?.id;
  const movieId = String(request.params.movieId);
  if (!userId) return response.status(401).json({ error: "Usuário não autenticado." });

  try {
    await removeMovieFromWishlist(userId, movieId);
    return response.status(204).send();
  } catch (error) {
    if (isServiceError(error) && error.code === "WISHLIST_ITEM_NOT_FOUND") {
      return response.status(404).json({ error: error.message });
    }
    return response.status(500).json({ error: "Erro ao remover da lista de desejos." });
  }
}
