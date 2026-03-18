import { Router } from "express";
import { modulePermissions } from "../constants/permissions.js";
import { approveRequest, createRequest, getRequests } from "../controllers/requestController.js";
import { requireAuth, requirePermission, requireSuperAdmin } from "../middleware/authMiddleware.js";

export const requestRoutes = Router();

requestRoutes.get("/requests", requireAuth, requirePermission(modulePermissions.requests), getRequests);
requestRoutes.post("/requests", requireAuth, requirePermission(modulePermissions.requests), createRequest);
requestRoutes.post("/requests/:requestId/approve", requireAuth, requirePermission(modulePermissions.requests), requireSuperAdmin, approveRequest);
