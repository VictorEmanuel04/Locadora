import type { Request, Response } from "express";
import { processCheckout, listUserRentals, processRenewal } from "../services/rentalService";

export async function checkout(request: Request, response: Response) {
  const userId = request.user?.id;
  const { movieIds } = request.body as { movieIds: string[] };

  if (!userId || !Array.isArray(movieIds) || movieIds.length === 0) {
    return response.status(400).json({ error: "Informe ao menos um filme para locacao." });
  }

  try {
    const rentals = await processCheckout(userId, movieIds);
    return response.status(201).json({ data: rentals });
  } catch (error: any) {
    return response.status(400).json({ error: error.message });
  }
}

export async function listMyRentals(request: Request, response: Response) {
  const userId = request.user?.id;

  if (!userId) {
    return response.status(401).json({ error: "Usuario nao autenticado." });
  }

  try {
    const rentalsData = await listUserRentals(userId);
    return response.json({ data: rentalsData });
  } catch (error) {
    return response.status(500).json({ error: "Erro interno ao buscar locacoes." });
  }
}

export async function renewRental(request: Request, response: Response) {
  const userId = request.user?.id;
  const rentalId = String(request.params.id);

  if (!userId) {
    return response.status(401).json({ error: "Usuario nao autenticado." });
  }

  try {
    const renewal = await processRenewal(userId, rentalId);
    return response.status(201).json({ data: renewal });
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return response.status(404).json({ error: "Locacao nao encontrada ou nao pertence a este usuario." });
    }
    return response.status(500).json({ error: "Erro interno ao renovar locacao." });
  }
}