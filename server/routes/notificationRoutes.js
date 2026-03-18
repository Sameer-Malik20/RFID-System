import { Router } from "express";
import { markRead } from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const notificationRoutes = Router();

notificationRoutes.post("/notifications/:notificationId/read", requireAuth, markRead);
