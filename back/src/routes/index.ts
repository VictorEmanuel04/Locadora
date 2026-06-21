import { Router } from "express";
import { healthCheck } from "../controllers/healthController.js";
import { adminRoutes } from "./adminRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { movieRoutes } from "./movieRoutes.js";
import { rentalRoutes } from "./rentalRoutes.js";

export const routes = Router();

routes.get("/health", healthCheck);
routes.use("/auth", authRoutes);
routes.use("/movies", movieRoutes);
routes.use("/rentals", rentalRoutes);
routes.use("/admin", adminRoutes);
