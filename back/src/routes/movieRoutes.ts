import { Router } from "express";
import { getMovieById, listMovies } from "../controllers/movieController.js";

export const movieRoutes = Router();

movieRoutes.get("/", listMovies);
movieRoutes.get("/:id", getMovieById);
