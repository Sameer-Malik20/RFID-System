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
    roleLabel: "Super Admin",
    permissions: Object.values(modulePermissions),
    canManageUsers: true,
    canApproveRequests: true,
    canSeeAllData: true,
  },
  DEPARTMENT_HEAD: {
    roleLabel: "Department Head",
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
  },
  OPERATIONS_USER: {
    roleLabel: "Operations User",
    permissions: [
      modulePermissions.dashboard,
      modulePermissions.assets,
      modulePermissions.assetLogs,
      modulePermissions.movementLogs,
      modulePermissions.maintenance,
      modulePermissions.lifecycle,
      modulePermissions.requests,
    ],
  },
  SECURITY_OFFICER: {
    roleLabel: "Security Officer",
    permissions: [
      modulePermissions.dashboard,
      modulePermissions.assets,
      modulePermissions.assetLogs,
      modulePermissions.movementLogs,
      modulePermissions.passiveDevices,
      modulePermissions.security,
      modulePermissions.requests,
    ],
  },
  ANALYST: {
    roleLabel: "Analyst",
    permissions: [
      modulePermissions.dashboard,
      modulePermissions.assets,
      modulePermissions.assetLogs,
      modulePermissions.lifecycle,
      modulePermissions.requests,
    ],
  },
};
