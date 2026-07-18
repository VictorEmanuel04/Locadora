import { prisma } from "../lib/prisma.js";
import { ServiceError } from "./serviceError.js";

export async function addMovieToCart(userId: string, movieId: string) {
  const existingItem = await prisma.cartItem.findUnique({
    where: { userId_movieId: { userId, movieId } }
  });

  if (existingItem) {
    throw new ServiceError("CART_ITEM_EXISTS", "Filme já está no carrinho.");
  }

  return prisma.cartItem.create({
    data: { userId, movieId },
    include: { movie: true }
  });
}

export function listCartItems(userId: string) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      movie: {
        select: {
          id: true,
          title: true,
          posterUrl: true,
          rentalPrice: true,
          discountPercentage: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function removeMovieFromCart(userId: string, movieId: string) {
  const result = await prisma.cartItem.deleteMany({ where: { userId, movieId } });
  if (result.count === 0) {
    throw new ServiceError("CART_ITEM_NOT_FOUND", "Item não encontrado no carrinho.");
  }
}
