import { query } from "../config/database.js";

export async function pingDatabase() {
  await query("SELECT 1");
}

export async function fetchWorkspaceRecords() {
  const [
    departments,
    users,
    assets,
    activities,
    checkoutLogs,
    movementLogs,
    repairTickets,
    maintenanceSchedules,
    securityLogs,
    rfidTags,
    beacons,
    hooters,
    utilizationTrend,
    requests,
    notifications,
  ] = await Promise.all([
    query('SELECT id, name, head_name AS "head", floor, extension, budget, mission FROM departments ORDER BY name'),
    query('SELECT id, full_name AS "fullName", email, department, position, role_key AS "roleKey", role_label AS "roleLabel", permissions, must_change_password AS "mustChangePassword", can_manage_users AS "canManageUsers", can_approve_requests AS "canApproveRequests", can_see_all_data AS "canSeeAllData" FROM app_users ORDER BY department, full_name'),
    query('SELECT id, name, type, department, assigned_to AS "assignedTo", purchase_date AS "purchaseDate", warranty_expiry AS "warrantyExpiry", status, location, value, verification_status AS "verificationStatus", lifecycle_status AS "lifecycleStatus", serial, vendor, notes FROM assets ORDER BY id'),
    query('SELECT id, title, detail, timestamp FROM activities ORDER BY timestamp DESC'),
    query('SELECT id, asset_id AS "assetId", asset_name AS "assetName", person, department, checked_out_at AS "checkedOutAt", expected_return AS "expectedReturn", checked_in_at AS "checkedInAt", status, location FROM checkout_logs ORDER BY checked_out_at DESC'),
    query('SELECT id, asset_id AS "assetId", asset_name AS "assetName", "from", "to", moved_by AS "movedBy", timestamp, type, approval_status AS "approvalStatus" FROM movement_logs ORDER BY timestamp DESC'),
    query('SELECT id, asset_id AS "assetId", asset_name AS "assetName", issue, technician, status, opened_at AS "openedAt", eta, cost, priority FROM repair_tickets ORDER BY opened_at DESC'),
    query('SELECT id, asset_id AS "assetId", asset_name AS "assetName", department, due_date AS "dueDate", status, cadence FROM maintenance_schedules ORDER BY due_date ASC'),
    query('SELECT id, asset_id AS "assetId", asset_name AS "assetName", verified_by AS "verifiedBy", method, location, timestamp, status FROM security_logs ORDER BY timestamp DESC'),
    query('SELECT id, asset_id AS "assetId", location, battery, last_ping AS "lastPing" FROM rfid_tags ORDER BY id'),
    query('SELECT id, zone, last_seen AS "lastSeen", signal_strength AS "signalStrength" FROM beacons ORDER BY id'),
    query('SELECT id, location, last_triggered AS "lastTriggered", severity FROM hooters ORDER BY id'),
    query('SELECT month, active, maintenance, alerts FROM utilization_trend ORDER BY sort_order'),
    query('SELECT id, title, request_type AS "requestType", status, requester_user_id AS "requesterUserId", target_department AS "targetDepartment", details, submitted_at AS "submittedAt", reviewed_by AS "reviewedBy", reviewed_at AS "reviewedAt" FROM approval_requests ORDER BY submitted_at DESC'),
    query('SELECT id, user_id AS "userId", category, title, detail, severity, created_at AS "createdAt", link, read_at AS "readAt" FROM notifications ORDER BY created_at DESC'),
  ]);

  return {
    departments: departments.rows,
    users: users.rows,
    assets: assets.rows,
    activities: activities.rows,
    checkoutLogs: checkoutLogs.rows,
    movementLogs: movementLogs.rows,
    repairTickets: repairTickets.rows,
    maintenanceSchedules: maintenanceSchedules.rows,
    securityLogs: securityLogs.rows,
    passiveDevices: {
      rfidTags: rfidTags.rows,
      beacons: beacons.rows,
      hooters: hooters.rows,
    },
    utilizationTrend: utilizationTrend.rows,
    requests: requests.rows,
    notifications: notifications.rows,
  };
}
