import { canApproveRequests, canManageUsers, canSeeAllData, hasPermission, modulePermissions } from "../constants/permissions.js";
import { fetchWorkspaceRecords } from "../models/workspaceModel.js";

export async function getWorkspaceDataset() {
  return fetchWorkspaceRecords();
}

export function deriveAlerts(dataset) {
  return [
    ...dataset.maintenanceSchedules.filter((entry) => entry.status === "Overdue").map((entry) => ({
      id: `alert-${entry.id}`,
      severity: "high",
      title: `${entry.assetName} missed maintenance`,
      detail: `${entry.department} ${entry.cadence.toLowerCase()} maintenance is overdue.`,
      link: "/maintenance",
    })),
    ...dataset.checkoutLogs.filter((entry) => entry.status === "Overdue").map((entry) => ({
      id: `alert-${entry.id}`,
      severity: "high",
      title: `${entry.assetName} is overdue`,
      detail: `${entry.person} has not returned the asset.`,
      link: "/asset-logs",
    })),
    ...dataset.securityLogs.filter((entry) => entry.status === "Flagged" || entry.status === "Unverified").map((entry) => ({
      id: `alert-${entry.id}`,
      severity: entry.status === "Flagged" ? "high" : "medium",
      title: `${entry.assetName} requires review`,
      detail: `${entry.method} at ${entry.location} returned ${entry.status.toLowerCase()}.`,
      link: "/security",
    })),
    ...dataset.requests.filter((entry) => entry.status === "Pending").map((entry) => ({
      id: `alert-${entry.id}`,
      severity: "medium",
      title: `${entry.title} needs approval`,
      detail: `${entry.targetDepartment} request is pending executive review.`,
      link: "/requests",
    })),
  ];
}

export function buildSearchIndex(dataset) {
  return [
    ...dataset.assets.map((asset) => ({
      id: `asset-${asset.id}`,
      title: asset.name,
      subtitle: `${asset.id} | ${asset.department} | ${asset.status}`,
      route: `/assets/${asset.id}`,
      kind: "Asset",
    })),
    ...dataset.departments.map((department) => ({
      id: `department-${department.id}`,
      title: `${department.name} Department`,
      subtitle: department.head,
      route: "/departments",
      kind: "Department",
    })),
    ...dataset.requests.map((request) => ({
      id: `request-${request.id}`,
      title: request.title,
      subtitle: `${request.requestType} | ${request.status}`,
      route: "/requests",
      kind: "Request",
    })),
    ...dataset.users.map((entry) => ({
      id: `user-${entry.id}`,
      title: entry.fullName,
      subtitle: `${entry.department} | ${entry.position}`,
      route: "/users",
      kind: "User",
    })),
  ];
}

export function filterDatasetForUser(user, dataset) {
  if (canSeeAllData(user)) {
    return { ...dataset, alerts: deriveAlerts(dataset) };
  }

  const department = user.department;
  const ownName = user.fullName;
  const canSeeSecurity = hasPermission(user, modulePermissions.security) || hasPermission(user, modulePermissions.passiveDevices);
  const visibleAssets = dataset.assets.filter((asset) => canSeeSecurity || asset.department === department || asset.assignedTo === ownName);
  const visibleAssetIds = new Set(visibleAssets.map((asset) => asset.id));

  const filtered = {
    departments: dataset.departments,
    users: canManageUsers(user) ? dataset.users : dataset.users.filter((entry) => entry.department === department || entry.id === user.id),
    assets: visibleAssets,
    activities: dataset.activities.filter(
      (activity) =>
        activity.title.includes(department) ||
        activity.detail.includes(department) ||
        activity.title.includes(ownName) ||
        activity.detail.includes(ownName),
    ),
    checkoutLogs: dataset.checkoutLogs.filter((entry) => visibleAssetIds.has(entry.assetId) || entry.department === department || entry.person === ownName),
    movementLogs: dataset.movementLogs.filter((entry) => visibleAssetIds.has(entry.assetId)),
    repairTickets: dataset.repairTickets.filter((entry) => visibleAssetIds.has(entry.assetId)),
    maintenanceSchedules: dataset.maintenanceSchedules.filter((entry) => visibleAssetIds.has(entry.assetId)),
    securityLogs: canSeeSecurity ? dataset.securityLogs : dataset.securityLogs.filter((entry) => visibleAssetIds.has(entry.assetId)),
    passiveDevices: {
      rfidTags: canSeeSecurity ? dataset.passiveDevices.rfidTags : dataset.passiveDevices.rfidTags.filter((entry) => visibleAssetIds.has(entry.assetId)),
      beacons: canSeeSecurity ? dataset.passiveDevices.beacons : [],
      hooters: canSeeSecurity ? dataset.passiveDevices.hooters : [],
    },
    utilizationTrend: dataset.utilizationTrend,
    requests: canApproveRequests(user) ? dataset.requests : dataset.requests.filter((entry) => entry.requesterUserId === user.id || entry.targetDepartment === department),
    notifications: dataset.notifications.filter((entry) => !entry.userId || entry.userId === user.id),
  };

  return {
    ...filtered,
    alerts: deriveAlerts(filtered),
  };
}

export async function getWorkspacePayload(user) {
  const dataset = await getWorkspaceDataset();
  const filtered = filterDatasetForUser(user, dataset);
  return {
    ...filtered,
    searchIndex: buildSearchIndex(filtered),
  };
}
