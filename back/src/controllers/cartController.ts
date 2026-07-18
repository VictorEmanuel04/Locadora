import type { Request, Response } from "express";
import {
  addMovieToCart,
  listCartItems,
  removeMovieFromCart
} from "../services/cartService.js";
import { isServiceError } from "../services/serviceError.js";

export async function addToCart(request: Request, response: Response) {
  const userId = String(request.user?.id);
  const { movieId } = request.body;

  if (!movieId) {
    return response.status(400).json({ error: "O ID do filme é obrigatório." });
  }

  try {
    const cartItem = await addMovieToCart(userId, movieId);
    return response.status(201).json({ data: cartItem });
  } catch (error) {
    if (isServiceError(error) && error.code === "CART_ITEM_EXISTS") {
      return response.status(409).json({ error: error.message });
    }
    return response.status(500).json({ error: "Erro ao adicionar ao carrinho." });
  }
}

export async function getCart(request: Request, response: Response) {
  const userId = String(request.user?.id);

  try {
    const cartItems = await listCartItems(userId);
    return response.json({ data: cartItems });
  } catch {
    return response.status(500).json({ error: "Erro ao buscar carrinho." });
  }
}

export async function removeFromCart(request: Request, response: Response) {
  const userId = String(request.user?.id);
  const movieId = String(request.params.movieId);

  try {
    await removeMovieFromCart(userId, movieId);
    return response.status(204).send();
  } catch (error: unknown) {
    if (isServiceError(error) && error.code === "CART_ITEM_NOT_FOUND") {
      return response.status(404).json({ error: error.message });
    }
    return response.status(500).json({ error: "Erro ao remover item do carrinho." });
  }
}
