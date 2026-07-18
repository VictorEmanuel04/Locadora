import { Router } from "express";
import { createOrUpdateReview, getMovieReviews } from "../controllers/reviewController.js";
import { ensureAuthenticated } from "../middlewares/auth.js";

const reviewRoutes = Router();

// Rota pública: qualquer pessoa (mesmo sem logar) pode VER as avaliações de um filme
reviewRoutes.get("/movie/:movieId", getMovieReviews);

// Rota protegida: apenas logados podem CRIAR/EDITAR avaliação
reviewRoutes.post("/", ensureAuthenticated, createOrUpdateReview);

export { reviewRoutes };
