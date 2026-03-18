import {
  assets,
  checkoutLogs,
  departments,
  maintenanceSchedules,
  movementLogs,
  passiveDevices,
  recentActivities,
  repairTickets,
  securityLogs,
  utilizationTrend,
} from "./sampleData.js";
import { roleTemplates } from "../constants/permissions.js";

function roleMeta(roleKey) {
  const template = roleTemplates[roleKey];
  return {
    roleKey,
    roleLabel: template.label,
    permissions: template.permissions,
    canManageUsers: template.canManageUsers,
    canApproveRequests: template.canApproveRequests,
    canSeeAllData: template.canSeeAllData,
  };
}

export const seededUsers = [
  { id: "usr-super-1", fullName: "Sameer Javed", email: "superadmin@susalabs.com", department: "Executive", position: "Platform Super Admin", ...roleMeta("SUPER_ADMIN") },
  { id: "usr-it-1", fullName: "Rahul Sharma", email: "rahul.sharma@susalabs.com", department: "IT", position: "Infrastructure Lead", ...roleMeta("DEPARTMENT_HEAD") },
  { id: "usr-it-2", fullName: "Ananya Bose", email: "ananya.bose@susalabs.com", department: "IT", position: "Systems Administrator", ...roleMeta("ANALYST") },
  { id: "usr-it-3", fullName: "Rohan Verma", email: "rohan.verma@susalabs.com", department: "IT", position: "Network Engineer", ...roleMeta("ANALYST") },
  { id: "usr-hr-1", fullName: "Priya Singh", email: "priya.singh@susalabs.com", department: "HR", position: "HR Manager", ...roleMeta("DEPARTMENT_HEAD") },
  { id: "usr-hr-2", fullName: "Kavya Nair", email: "kavya.nair@susalabs.com", department: "HR", position: "HR Operations Specialist", ...roleMeta("ANALYST") },
  { id: "usr-fin-1", fullName: "Amit Kumar", email: "amit.kumar@susalabs.com", department: "Finance", position: "Finance Controller", ...roleMeta("DEPARTMENT_HEAD") },
  { id: "usr-fin-2", fullName: "Mehul Joshi", email: "mehul.joshi@susalabs.com", department: "Finance", position: "Finance Analyst", ...roleMeta("ANALYST") },
  { id: "usr-ops-1", fullName: "Neha Gupta", email: "neha.gupta@susalabs.com", department: "Operations", position: "Operations Head", ...roleMeta("DEPARTMENT_HEAD") },
  { id: "usr-ops-2", fullName: "Arjun Yadav", email: "arjun.yadav@susalabs.com", department: "Operations", position: "Warehouse Supervisor", ...roleMeta("OPERATIONS_USER") },
  { id: "usr-ops-3", fullName: "Simran Kaur", email: "simran.kaur@susalabs.com", department: "Operations", position: "Dispatch Executive", ...roleMeta("OPERATIONS_USER") },
  { id: "usr-sec-1", fullName: "Vijay Patel", email: "vijay.patel@susalabs.com", department: "Security", position: "Chief Security Officer", ...roleMeta("DEPARTMENT_HEAD") },
  { id: "usr-sec-2", fullName: "Danish Khan", email: "danish.khan@susalabs.com", department: "Security", position: "Security Officer", ...roleMeta("SECURITY_OFFICER") },
];

export const seededRequests = [
  {
    id: "req-1",
    title: "Replace Generator 10KVA",
    requestType: "Replacement",
    status: "Pending",
    requesterUserId: "usr-ops-1",
    targetDepartment: "Operations",
    details: "End-of-life generator requires capital approval for replacement.",
    submittedAt: "2026-03-16T16:05:00+05:30",
    reviewedBy: null,
    reviewedAt: null,
  },
  {
    id: "req-2",
    title: "Approve new HR printer pickup",
    requestType: "Asset Purchase",
    status: "Approved",
    requesterUserId: "usr-hr-1",
    targetDepartment: "HR",
    details: "Replacement printer request approved for onboarding operations.",
    submittedAt: "2026-03-15T10:15:00+05:30",
    reviewedBy: "Sameer Javed",
    reviewedAt: "2026-03-15T14:10:00+05:30",
  },
];

export const seededNotifications = [
  { id: "note-1", userId: "usr-super-1", category: "Request", title: "Operations submitted a generator replacement request", detail: "Generator 10KVA reached end of life and awaits executive approval.", severity: "high", createdAt: "2026-03-17T08:50:00+05:30", link: "/requests" },
  { id: "note-2", userId: null, category: "Maintenance", title: "AC Unit Daikin is overdue for service", detail: "Operations maintenance SLA is already breached.", severity: "medium", createdAt: "2026-03-17T07:15:00+05:30", link: "/maintenance" },
  { id: "note-3", userId: "usr-sec-2", category: "Security", title: "Flagged movement requires secondary scan", detail: "Generator 10KVA generated a flagged verification in utility yard.", severity: "high", createdAt: "2026-03-16T20:16:00+05:30", link: "/security" },
];

export const seededDashboardSnapshots = utilizationTrend;
export const seededActivities = recentActivities;
export const seededDepartments = departments;
export const seededAssets = assets;
export const seededCheckoutLogs = checkoutLogs;
export const seededMovementLogs = movementLogs;
export const seededRepairTickets = repairTickets;
export const seededMaintenanceSchedules = maintenanceSchedules;
export const seededSecurityLogs = securityLogs;
export const seededPassiveDevices = passiveDevices;
