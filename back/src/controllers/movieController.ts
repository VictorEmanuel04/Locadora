import type { Request, Response } from "express";
import { fetchMovies, fetchMovieById } from "../services/movieService.js";
import type { MovieFilters } from "../services/movieService.js";

export async function listMovies(request: Request, response: Response) {
  try {
    // Extraímos os parâmetros e tipamos de acordo com a interface do Service
    const filters: MovieFilters = {
      search: request.query.search as string,
      genre: request.query.genre as string,
      available: request.query.available as string,
    };

    const movies = await fetchMovies(filters);
    return response.json({ data: movies });
  } catch (error) {
    return response.status(500).json({ error: "Erro interno ao buscar a lista de filmes." });
  }
}

export async function getMovieById(request: Request, response: Response) {
  const movieId = String(request.params.id);

  try {
    const movie = await fetchMovieById(movieId);

    // Como o Service retorna null se não achar, o Controller decide enviar o 404
    if (!movie) {
      return response.status(404).json({ error: "Filme nao encontrado." });
    }

    return response.json({ data: movie });
  } catch (error) {
    return response.status(500).json({ error: "Erro interno ao buscar detalhes do filme." });
  }
}