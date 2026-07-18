import { Router } from "express";
import { createOrUpdateReview, getMovieReviews } from "../controllers/reviewController.js";
import { ensureAuthenticated } from "../middlewares/auth.js";

const reviewRoutes = Router();

reviewRoutes.get("/movie/:movieId", getMovieReviews);

reviewRoutes.post("/", ensureAuthenticated, createOrUpdateReview);

export { reviewRoutes };
