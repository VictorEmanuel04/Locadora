import { Router } from "express";
import { getPublicUserProfile } from "../controllers/userController.js";

export const userRoutes = Router();

userRoutes.get("/:id/profile", getPublicUserProfile);
