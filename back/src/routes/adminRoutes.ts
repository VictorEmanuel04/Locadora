import { Router } from "express";
import { createMovie, deleteMovie, updateMovie, deleteReview } from "../controllers/adminMovieController.js";
import { ensureAdmin, ensureAuthenticated } from "../middlewares/auth.js";

export const adminRoutes = Router();

adminRoutes.use(ensureAuthenticated, ensureAdmin);
adminRoutes.post("/movies", createMovie);
adminRoutes.put("/movies/:id", updateMovie);
adminRoutes.delete("/movies/:id", deleteMovie);
adminRoutes.delete("/reviews/:id", deleteReview);
