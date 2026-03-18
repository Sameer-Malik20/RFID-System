import { canApproveRequests, canManageUsers, canSeeAllData } from "../constants/permissions.js";
import { hasPermission } from "../constants/permissions.js";
import { findUserById, sanitizeUser } from "../models/userModel.js";
import { verifyToken } from "../utils/auth.js";

export async function requireAuth(req, res, next) {
  const authorization = req.headers.authorization ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const payload = verifyToken(token);
    const user = await findUserById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: "Session is no longer valid." });
    }
    if ((payload.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
      return res.status(401).json({ message: "Session has been rotated. Please sign in again." });
    }
    req.user = sanitizeUser(user);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

export function requireSuperAdmin(req, res, next) {
  if (!canManageUsers(req.user) && !canApproveRequests(req.user) && !canSeeAllData(req.user)) {
    return res.status(403).json({ message: "This action requires super admin access." });
  }
  return next();
}

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!hasPermission(req.user, permission)) {
      return res.status(403).json({ message: "This action is outside your current access scope." });
    }
    return next();
  };
}
