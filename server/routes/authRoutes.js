import { Router } from "express";
import { changePassword, login, me } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.get("/me", requireAuth, me);
authRoutes.post("/change-password", requireAuth, changePassword);
