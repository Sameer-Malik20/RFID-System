export const modulePermissions = {
  dashboard: "dashboard",
  assets: "assets",
  departments: "departments",
  assetLogs: "asset_logs",
  movementLogs: "movement_logs",
  maintenance: "maintenance",
  lifecycle: "lifecycle",
  passiveDevices: "passive_devices",
  security: "security",
  users: "users",
  requests: "requests",
};

export const roleTemplates = {
  SUPER_ADMIN: {
    label: "Super Admin",
    permissions: Object.values(modulePermissions),
    canManageUsers: true,
    canApproveRequests: true,
    canSeeAllData: true,
  },
  DEPARTMENT_HEAD: {
    label: "Department Head",
    permissions: [
      modulePermissions.dashboard,
      modulePermissions.assets,
      modulePermissions.departments,
      modulePermissions.assetLogs,
      modulePermissions.movementLogs,
      modulePermissions.maintenance,
      modulePermissions.lifecycle,
      modulePermissions.requests,
    ],
    canManageUsers: false,
    canApproveRequests: false,
    canSeeAllData: false,
  },
  OPERATIONS_USER: {
    label: "Operations User",
    permissions: [
      modulePermissions.dashboard,
      modulePermissions.assets,
      modulePermissions.assetLogs,
      modulePermissions.movementLogs,
      modulePermissions.maintenance,
      modulePermissions.lifecycle,
      modulePermissions.requests,
    ],
    canManageUsers: false,
    canApproveRequests: false,
    canSeeAllData: false,
  },
  SECURITY_OFFICER: {
    label: "Security Officer",
    permissions: [
      modulePermissions.dashboard,
      modulePermissions.assets,
      modulePermissions.assetLogs,
      modulePermissions.movementLogs,
      modulePermissions.passiveDevices,
      modulePermissions.security,
      modulePermissions.requests,
    ],
    canManageUsers: false,
    canApproveRequests: false,
    canSeeAllData: false,
  },
  ANALYST: {
    label: "Analyst",
    permissions: [
      modulePermissions.dashboard,
      modulePermissions.assets,
      modulePermissions.assetLogs,
      modulePermissions.lifecycle,
      modulePermissions.requests,
    ],
    canManageUsers: false,
    canApproveRequests: false,
    canSeeAllData: false,
  },
};

export function hasPermission(user, permission) {
  return Boolean(user?.permissions?.includes(permission));
}

export function canManageUsers(user) {
  return Boolean(user?.canManageUsers);
}

export function canApproveRequests(user) {
  return Boolean(user?.canApproveRequests);
}

export function canSeeAllData(user) {
  return Boolean(user?.canSeeAllData);
}
