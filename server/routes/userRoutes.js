import { Router } from "express";
import { createUser, getUsers, updateUser } from "../controllers/userController.js";
import { requireAuth, requireSuperAdmin } from "../middleware/authMiddleware.js";

export const userRoutes = Router();

userRoutes.get("/users", requireAuth, requireSuperAdmin, getUsers);
userRoutes.post("/users", requireAuth, requireSuperAdmin, createUser);
userRoutes.put("/users/:userId", requireAuth, requireSuperAdmin, updateUser);
