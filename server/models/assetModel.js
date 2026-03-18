import { query } from "../config/database.js";

function getExecutor(executor) {
  return executor ?? { query };
}

export async function insertAsset(asset, executor) {
  const db = getExecutor(executor);
  await db.query(
    "INSERT INTO assets (id, name, type, department, assigned_to, purchase_date, warranty_expiry, status, location, value, verification_status, lifecycle_status, serial, vendor, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)",
    [asset.id, asset.name, asset.type, asset.department, asset.assignedTo, asset.purchaseDate, asset.warrantyExpiry, asset.status, asset.location, asset.value, asset.verificationStatus, asset.lifecycleStatus, asset.serial, asset.vendor, asset.notes ?? ""],
  );
}

export async function updateAsset(assetId, asset, executor) {
  const db = getExecutor(executor);
  await db.query(
    "UPDATE assets SET name = $1, type = $2, department = $3, assigned_to = $4, purchase_date = $5, warranty_expiry = $6, status = $7, location = $8, value = $9, verification_status = $10, lifecycle_status = $11, serial = $12, vendor = $13, notes = $14 WHERE id = $15",
    [asset.name, asset.type, asset.department, asset.assignedTo, asset.purchaseDate, asset.warrantyExpiry, asset.status, asset.location, asset.value, asset.verificationStatus, asset.lifecycleStatus, asset.serial, asset.vendor, asset.notes ?? "", assetId],
  );
}

export async function findAssetById(assetId, executor) {
  const db = getExecutor(executor);
  const result = await db.query('SELECT id, name, department, assigned_to AS "assignedTo", location, status, verification_status AS "verificationStatus" FROM assets WHERE id = $1', [assetId]);
  return result.rows[0] ?? null;
}

export async function insertActivity(activity, executor) {
  const db = getExecutor(executor);
  await db.query("INSERT INTO activities (id, title, detail, timestamp) VALUES ($1, $2, $3, $4)", [activity.id, activity.title, activity.detail, activity.timestamp]);
}

export async function findCheckoutLogById(logId, executor) {
  const db = getExecutor(executor);
  const result = await db.query('SELECT id, asset_id AS "assetId", department, person FROM checkout_logs WHERE id = $1', [logId]);
  return result.rows[0] ?? null;
}

export async function checkInCheckoutLog(logId, timestamp, executor) {
  const db = getExecutor(executor);
  await db.query("UPDATE checkout_logs SET checked_in_at = $1, status = 'Completed' WHERE id = $2", [timestamp, logId]);
}

export async function updateAssetLocationAndDepartment(assetId, department, location, executor) {
  const db = getExecutor(executor);
  await db.query("UPDATE assets SET department = $1, location = $2 WHERE id = $3", [department, location, assetId]);
}

export async function insertMovementLog(log, executor) {
  const db = getExecutor(executor);
  await db.query('INSERT INTO movement_logs (id, asset_id, asset_name, "from", "to", moved_by, timestamp, type, approval_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [log.id, log.assetId, log.assetName, log.from, log.to, log.movedBy, log.timestamp, log.type, log.approvalStatus]);
}

export async function insertRepairTicket(ticket, executor) {
  const db = getExecutor(executor);
  await db.query("INSERT INTO repair_tickets (id, asset_id, asset_name, issue, technician, status, opened_at, eta, cost, priority) VALUES ($1, $2, $3, $4, $5, 'Pending', $6, $7, $8, $9)", [ticket.id, ticket.assetId, ticket.assetName, ticket.issue, ticket.technician, ticket.openedAt, ticket.eta, ticket.cost, ticket.priority]);
}

export async function insertSecurityLog(log, executor) {
  const db = getExecutor(executor);
  await db.query("INSERT INTO security_logs (id, asset_id, asset_name, verified_by, method, location, timestamp, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [log.id, log.assetId, log.assetName, log.verifiedBy, log.method, log.location, log.timestamp, log.status]);
}

export async function updateAssetVerificationStatus(assetId, status, executor) {
  const db = getExecutor(executor);
  await db.query("UPDATE assets SET verification_status = $1 WHERE id = $2", [status, assetId]);
}
