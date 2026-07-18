import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function addToCart(request: Request, response: Response) {
  const userId = String(request.user?.id);
  const { movieId } = request.body;

  if (!movieId) {
    return response.status(400).json({ error: "O ID do filme é obrigatório." });
  }

  try {
    const existingItem = await prisma.cartItem.findUnique({
      where: { userId_movieId: { userId, movieId } }
    });

    if (existingItem) {
      return response.status(409).json({ error: "Filme já está no carrinho." });
    }

    const cartItem = await prisma.cartItem.create({
      data: { userId, movieId },
      include: { movie: true }
    });

    return response.status(201).json({ data: cartItem });
  } catch {
    return response.status(500).json({ error: "Erro ao adicionar ao carrinho." });
  }
}

export async function getCart(request: Request, response: Response) {
  const userId = String(request.user?.id);

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { 
        movie: {
          select: { id: true, title: true, posterUrl: true, rentalPrice: true, discountPercentage: true }
        } 
      },
      orderBy: { createdAt: 'desc' }
    });

    return response.json({ data: cartItems });
  } catch {
    return response.status(500).json({ error: "Erro ao buscar carrinho." });
  }
}

export async function removeFromCart(request: Request, response: Response) {
  const userId = String(request.user?.id);
  const movieId = String(request.params.movieId);

  try {
    await prisma.cartItem.delete({
      where: { userId_movieId: { userId, movieId } }
    });

    return response.status(204).send();
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
      return response.status(404).json({ error: "Item não encontrado no carrinho." });
    }
    return response.status(500).json({ error: "Erro ao remover item do carrinho." });
  }
}
