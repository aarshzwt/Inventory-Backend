import { Router } from "express";
import { authorizeRole } from "../middlewares/authorizeRole";
import { addToCart, checkoutCart, getCart, getOrderHistory, mergeCart, removeCartItem, updateCartItem } from "../controllers/cart.controller";

const router = Router();

router.post("/", addToCart);
router.get("/", authorizeRole(["user", "admin"]), getCart);
router.get("/orders", authorizeRole(["user"]), getOrderHistory)
router.post("/merge", authorizeRole(["user"]), mergeCart)

router.patch("/:cartItemId", authorizeRole(["user", "admin"]), updateCartItem);
router.delete("/:cartItemId", authorizeRole(["user", "admin"]), removeCartItem);
router.post("/checkout", authorizeRole(["admin", "user"]), checkoutCart)

export { router as cart };