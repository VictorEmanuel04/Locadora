import { Router } from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController";
import { ensureAuthenticated } from "../middlewares/auth";

const cartRoutes = Router();

cartRoutes.use(ensureAuthenticated);

cartRoutes.post("/", addToCart);
cartRoutes.get("/", getCart);
cartRoutes.delete("/:movieId", removeFromCart);

export { cartRoutes };