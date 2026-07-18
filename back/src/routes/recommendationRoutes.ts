import { Router } from "express";
import { getRecommendations } from "../controllers/recommendationController.js";
import { ensureAuthenticated } from "../middlewares/auth.js";

const recommendationRoutes = Router();

recommendationRoutes.get("/", ensureAuthenticated, getRecommendations);

export { recommendationRoutes };
