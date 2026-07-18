import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getPublicUserProfile(request: Request, response: Response) {
  const userId = String(request.params.id);

  const user = await prisma.user.findUnique({
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

  if (!user) {
    return response.status(404).json({ error: "Usuário não encontrado." });
  }

  return response.json({ data: user });
}
