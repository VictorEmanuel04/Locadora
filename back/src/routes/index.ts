import { Router } from "express";
import { healthCheck } from "../controllers/healthController.js";
import { adminRoutes } from "./adminRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { movieRoutes } from "./movieRoutes.js";
import { rentalRoutes } from "./rentalRoutes.js";
import { cartRoutes } from "./cartRoutes.js";
import { recommendationRoutes } from "./recommendationRoutes.js";
import { wishlistRoutes } from "./wishlistRoutes.js";
import { reviewRoutes } from "./reviewRoutes.js";

export const routes = Router();

routes.get("/health", healthCheck);
routes.use("/auth", authRoutes);
routes.use("/movies", movieRoutes);
routes.use("/rentals", rentalRoutes);
routes.use("/cart", cartRoutes);
routes.use("/recommendations", recommendationRoutes);
routes.use("/admin", adminRoutes);
routes.use("/wishlist", wishlistRoutes);
routes.use("/reviews", reviewRoutes);
