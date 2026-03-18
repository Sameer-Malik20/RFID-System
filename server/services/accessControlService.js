import { canSeeAllData, hasPermission, modulePermissions } from "../constants/permissions.js";

function createAccessError(message) {
  const error = new Error(message);
  error.status = 403;
  return error;
}

export function canAccessAsset(user, asset) {
  if (!asset) {
    return false;
  }

  if (canSeeAllData(user)) {
    return true;
  }

  const canSeeSecurityEstate = hasPermission(user, modulePermissions.security) || hasPermission(user, modulePermissions.passiveDevices);
  return canSeeSecurityEstate || asset.department === user.department || asset.assignedTo === user.fullName;
}

export function assertAssetAccess(user, asset) {
  if (!canAccessAsset(user, asset)) {
    throw createAccessError("This asset is outside your current access scope.");
  }
}

export function assertDepartmentWriteAccess(user, department) {
  if (!canSeeAllData(user) && department !== user.department) {
    throw createAccessError("You can only write records for your own department.");
  }
}

export function assertCheckoutAccess(user, checkoutLog, asset) {
  if (canSeeAllData(user)) {
    return;
  }

  if (asset && canAccessAsset(user, asset)) {
    return;
  }

  if (checkoutLog?.department === user.department || checkoutLog?.person === user.fullName) {
    return;
  }

  throw createAccessError("This checkout record is outside your current access scope.");
}
