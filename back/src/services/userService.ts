import { prisma } from "../lib/prisma.js";

export function findPublicUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      createdAt: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          movie: {
            select: {
              id: true,
              title: true,
              posterUrl: true,
              genre: true,
              releaseYear: true
            }
          }
        }
      }
    }
  });
}
