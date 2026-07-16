import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function addToWishlist(request: Request, response: Response) {
  // Assumindo que seu middleware de auth coloca o usuário no request
  const userId = request.user?.id; 
  const { movieId } = request.body;

  if (!userId) return response.status(401).json({ error: "Usuário não autenticado." });
  if (!movieId) return response.status(400).json({ error: "O ID do filme é obrigatório." });

  try {
    // Verifica se já existe para não dar erro no @@unique
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_movieId: { userId, movieId }
      }
    });

    if (existingItem) {
      return response.status(409).json({ error: "Filme já está na sua lista de desejos." });
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: { userId, movieId },
      include: { movie: true } // Já retorna os dados do filme para o frontend atualizar a tela
    });

    return response.status(201).json({ data: wishlistItem });
  } catch (error) {
    return response.status(500).json({ error: "Erro interno ao adicionar à wishlist." });
  }
}

export async function getMyWishlist(request: Request, response: Response) {
  const userId = request.user?.id;
  if (!userId) return response.status(401).json({ error: "Usuário não autenticado." });

  try {
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId },
      include: { 
        movie: {
          select: { id: true, title: true, posterUrl: true, rentalPrice: true }
        } 
      },
      orderBy: { createdAt: 'desc' }
    });

    return response.json({ data: wishlist });
  } catch (error) {
    return response.status(500).json({ error: "Erro ao buscar lista de desejos." });
  }
}

export async function removeFromWishlist(request: Request, response: Response) {
  const userId = request.user?.id;
  const movieId = String(request.params.movieId);

  if (!userId) return response.status(401).json({ error: "Usuário não autenticado." });

  try {
    await prisma.wishlistItem.delete({
      where: {
        userId_movieId: { userId, movieId }
      }
    });

    return response.status(204).send(); // 204 = No Content (sucesso, sem corpo de resposta)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return response.status(404).json({ error: "Filme não encontrado na sua wishlist." });
    }
    return response.status(500).json({ error: "Erro ao remover da lista de desejos." });
  }
}