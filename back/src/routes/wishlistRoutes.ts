import { Router } from "express";
import { addToWishlist, getMyWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import { ensureAuthenticated } from "../middlewares/auth.js";

const wishlistRoutes = Router();

// Todas as rotas de wishlist precisam de usuário logado
wishlistRoutes.use(ensureAuthenticated);

wishlistRoutes.post("/", addToWishlist);
wishlistRoutes.get("/", getMyWishlist);
wishlistRoutes.delete("/:movieId", removeFromWishlist);

export { wishlistRoutes };
