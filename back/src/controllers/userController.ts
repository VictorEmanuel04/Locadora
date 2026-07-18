import type { Request, Response } from "express";
import { findPublicUserProfile } from "../services/userService.js";

export async function getPublicUserProfile(request: Request, response: Response) {
  const user = await findPublicUserProfile(String(request.params.id));

  if (!user) {
    return response.status(404).json({ error: "Usuário não encontrado." });
  }

  return response.json({ data: user });
}
