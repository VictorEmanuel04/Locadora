import { Router } from "express";
import { addToWishlist, getMyWishlist, removeFromWishlist } from "../controllers/wishlistController";
import { ensureAuthenticated } from "../middlewares/auth"; // Ajuste o nome do import se necessário

const wishlistRoutes = Router();

// Todas as rotas de wishlist precisam de usuário logado
wishlistRoutes.use(ensureAuthenticated);

wishlistRoutes.post("/", addToWishlist);
wishlistRoutes.get("/", getMyWishlist);
wishlistRoutes.delete("/:movieId", removeFromWishlist);

export { wishlistRoutes };