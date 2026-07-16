import { Router } from "express";
import { getRecommendations } from "../controllers/recommendationController";
import { ensureAuthenticated } from "../middlewares/auth";

const recommendationRoutes = Router();

recommendationRoutes.get("/", ensureAuthenticated, getRecommendations);

export { recommendationRoutes };