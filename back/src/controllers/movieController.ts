import type { Request, Response } from "express";
import { fetchMovies, fetchMovieById } from "../services/movieService.js";
import type { MovieFilters } from "../services/movieService.js";

export async function listMovies(request: Request, response: Response) {
  try {
    // Extraímos os parâmetros normais e a paginação da query
    const filters: MovieFilters = {
      search: request.query.search as string,
      genre: request.query.genre as string,
      available: request.query.available as string,
      page: Number(request.query.page) || 1,     // Padrão: página 1
      limit: Number(request.query.limit) || 10,  // Padrão: 10 itens por página
    };

    // O Service agora deve retornar os filmes e os metadados (total de páginas, etc)
    const result = await fetchMovies(filters);
    
    // Retornamos o objeto completo (data e meta) para o frontend
    return response.json(result);
  } catch (error) {
    return response.status(500).json({ error: "Erro interno ao buscar a lista de filmes." });
  }
}

export async function getMovieById(request: Request, response: Response) {
  const movieId = String(request.params.id);

  try {
    const movie = await fetchMovieById(movieId);

    if (!movie) {
      return response.status(404).json({ error: "Filme nao encontrado." });
    }

    return response.json({ data: movie });
  } catch (error) {
    return response.status(500).json({ error: "Erro interno ao buscar detalhes do filme." });
  }
}