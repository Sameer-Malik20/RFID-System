import { Router } from "express";
import { getBootstrap, getSearch } from "../controllers/workspaceController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const workspaceRoutes = Router();

workspaceRoutes.get("/bootstrap", requireAuth, getBootstrap);
workspaceRoutes.get("/search", requireAuth, getSearch);
