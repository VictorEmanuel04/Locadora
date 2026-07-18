import { prisma } from "../lib/prisma.js";
import { ServiceError } from "./serviceError.js";

export async function addMovieToWishlist(userId: string, movieId: string) {
  const existingItem = await prisma.wishlistItem.findUnique({
    where: { userId_movieId: { userId, movieId } }
  });

  if (existingItem) {
    throw new ServiceError(
      "WISHLIST_ITEM_EXISTS",
      "Filme já está na sua lista de desejos."
    );
  }

  return prisma.wishlistItem.create({
    data: { userId, movieId },
    include: { movie: true }
  });
}

export function listWishlistItems(userId: string) {
  return prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      movie: {
        select: { id: true, title: true, posterUrl: true, rentalPrice: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function removeMovieFromWishlist(userId: string, movieId: string) {
  const result = await prisma.wishlistItem.deleteMany({ where: { userId, movieId } });
  if (result.count === 0) {
    throw new ServiceError(
      "WISHLIST_ITEM_NOT_FOUND",
      "Filme não encontrado na sua wishlist."
    );
  }
}
