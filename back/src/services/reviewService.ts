import { prisma } from "../lib/prisma.js";
import { ServiceError } from "./serviceError.js";

type ReviewInput = {
  movieId?: string;
  rating?: number;
  comment?: string | null;
};

export async function saveUserReview(userId: string, input: ReviewInput) {
  const { movieId, rating, comment } = input;

  if (!movieId || rating === undefined) {
    throw new ServiceError(
      "REVIEW_DATA_REQUIRED",
      "Filme e nota (rating) são obrigatórios."
    );
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ServiceError("INVALID_RATING", "A nota deve ser entre 1 e 5.");
  }

  return prisma.review.upsert({
    where: { userId_movieId: { userId, movieId } },
    update: { rating, comment },
    create: { userId, movieId, rating, comment },
    include: { user: { select: { name: true } } }
  });
}

export async function listMovieReviews(movieId: string) {
  const reviews = await prisma.review.findMany({
    where: { movieId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" }
  });

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0
    ? (totalRating / reviews.length).toFixed(1)
    : 0;

  return {
    reviews,
    meta: { averageRating, totalReviews: reviews.length }
  };
}
