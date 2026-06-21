import { Router } from "express";
import { checkout, listMyRentals, renewRental } from "../controllers/rentalController.js";
import { ensureAuthenticated } from "../middlewares/auth.js";

export const rentalRoutes = Router();

rentalRoutes.use(ensureAuthenticated);
rentalRoutes.get("/", listMyRentals);
rentalRoutes.post("/checkout", checkout);
rentalRoutes.post("/:id/renew", renewRental);
