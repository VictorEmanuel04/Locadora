import { MovieAvailability } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export async function findRecommendationsForUser(userId: string) {
  const userRentals = await prisma.rental.findMany({
    where: { userId },
    include: { movie: true }
  });

  if (userRentals.length === 0) {
    const movies = await prisma.movie.findMany({
      where: { availability: MovieAvailability.AVAILABLE },
      orderBy: { createdAt: "desc" },
      take: 5
    });
    return { movies, reason: "NEW_RELEASES" };
  }

  const genreCounts = userRentals.reduce<Record<string, number>>((counts, rental) => {
    counts[rental.movie.genre] = (counts[rental.movie.genre] ?? 0) + 1;
    return counts;
  }, {});
  const favoriteGenre = Object.entries(genreCounts).reduce(
    (favorite, current) => current[1] > favorite[1] ? current : favorite
  )[0];

  const movies = await prisma.movie.findMany({
    where: {
      genre: favoriteGenre,
      availability: MovieAvailability.AVAILABLE,
      id: { notIn: userRentals.map((rental) => rental.movieId) }
    },
    take: 5
  });

  return {
    movies,
    reason: `Porque você assiste muito ${favoriteGenre}`
  };
}
