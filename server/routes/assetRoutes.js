import { Router } from "express";
import { checkInAsset, createAsset, createRepairTicket, createSecurityScan, importAssets, transferAsset, updateAssetById } from "../controllers/assetController.js";
import { requireAuth, requirePermission } from "../middleware/authMiddleware.js";
import { modulePermissions } from "../constants/permissions.js";

export const assetRoutes = Router();

assetRoutes.post("/assets", requireAuth, requirePermission(modulePermissions.assets), createAsset);
assetRoutes.post("/assets/import", requireAuth, requirePermission(modulePermissions.assets), importAssets);
assetRoutes.put("/assets/:assetId", requireAuth, requirePermission(modulePermissions.assets), updateAssetById);
assetRoutes.post("/checkouts/:logId/check-in", requireAuth, requirePermission(modulePermissions.assetLogs), checkInAsset);
assetRoutes.post("/transfers", requireAuth, requirePermission(modulePermissions.departments), transferAsset);
assetRoutes.post("/repair-tickets", requireAuth, requirePermission(modulePermissions.maintenance), createRepairTicket);
assetRoutes.post("/security-scans", requireAuth, requirePermission(modulePermissions.security), createSecurityScan);
