import bcrypt from "bcryptjs";
import { pathToFileURL } from "node:url";
import { pool } from "../config/database.js";
import {
  seededActivities,
  seededAssets,
  seededCheckoutLogs,
  seededDashboardSnapshots,
  seededDepartments,
  seededMaintenanceSchedules,
  seededMovementLogs,
  seededNotifications,
  seededPassiveDevices,
  seededRepairTickets,
  seededRequests,
  seededSecurityLogs,
  seededUsers,
} from "../data/seedData.js";

const defaultPassword = "ChangeMe123";

async function createSchema(client) {
  await client.query(`
      CREATE TABLE IF NOT EXISTS departments (id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, head_name TEXT NOT NULL, floor TEXT NOT NULL, extension TEXT NOT NULL, budget NUMERIC NOT NULL, mission TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS app_users (id TEXT PRIMARY KEY, full_name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, department TEXT NOT NULL, position TEXT NOT NULL, role_key TEXT NOT NULL, role_label TEXT NOT NULL, permissions TEXT[] NOT NULL, must_change_password BOOLEAN NOT NULL DEFAULT TRUE, can_manage_users BOOLEAN NOT NULL DEFAULT FALSE, can_approve_requests BOOLEAN NOT NULL DEFAULT FALSE, can_see_all_data BOOLEAN NOT NULL DEFAULT FALSE, token_version INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS assets (id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL, department TEXT NOT NULL, assigned_to TEXT NOT NULL, purchase_date DATE NOT NULL, warranty_expiry DATE NOT NULL, status TEXT NOT NULL, location TEXT NOT NULL, value NUMERIC NOT NULL, verification_status TEXT NOT NULL, lifecycle_status TEXT NOT NULL, serial TEXT NOT NULL, vendor TEXT NOT NULL, notes TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS activities (id TEXT PRIMARY KEY, title TEXT NOT NULL, detail TEXT NOT NULL, timestamp TIMESTAMPTZ NOT NULL);
      CREATE TABLE IF NOT EXISTS checkout_logs (id TEXT PRIMARY KEY, asset_id TEXT NOT NULL, asset_name TEXT NOT NULL, person TEXT NOT NULL, department TEXT NOT NULL, checked_out_at TIMESTAMPTZ NOT NULL, expected_return TIMESTAMPTZ NOT NULL, checked_in_at TIMESTAMPTZ, status TEXT NOT NULL, location TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS movement_logs (id TEXT PRIMARY KEY, asset_id TEXT NOT NULL, asset_name TEXT NOT NULL, "from" TEXT NOT NULL, "to" TEXT NOT NULL, moved_by TEXT NOT NULL, timestamp TIMESTAMPTZ NOT NULL, type TEXT NOT NULL, approval_status TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS repair_tickets (id TEXT PRIMARY KEY, asset_id TEXT NOT NULL, asset_name TEXT NOT NULL, issue TEXT NOT NULL, technician TEXT NOT NULL, status TEXT NOT NULL, opened_at DATE NOT NULL, eta DATE NOT NULL, cost NUMERIC NOT NULL, priority TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS maintenance_schedules (id TEXT PRIMARY KEY, asset_id TEXT NOT NULL, asset_name TEXT NOT NULL, department TEXT NOT NULL, due_date DATE NOT NULL, status TEXT NOT NULL, cadence TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS security_logs (id TEXT PRIMARY KEY, asset_id TEXT NOT NULL, asset_name TEXT NOT NULL, verified_by TEXT NOT NULL, method TEXT NOT NULL, location TEXT NOT NULL, timestamp TIMESTAMPTZ NOT NULL, status TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS rfid_tags (id TEXT PRIMARY KEY, asset_id TEXT NOT NULL, location TEXT NOT NULL, battery INTEGER NOT NULL, last_ping TIMESTAMPTZ NOT NULL);
      CREATE TABLE IF NOT EXISTS beacons (id TEXT PRIMARY KEY, zone TEXT NOT NULL, last_seen TIMESTAMPTZ NOT NULL, signal_strength INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS hooters (id TEXT PRIMARY KEY, location TEXT NOT NULL, last_triggered TIMESTAMPTZ NOT NULL, severity TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS utilization_trend (month TEXT PRIMARY KEY, active INTEGER NOT NULL, maintenance INTEGER NOT NULL, alerts INTEGER NOT NULL, sort_order INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS approval_requests (id TEXT PRIMARY KEY, title TEXT NOT NULL, request_type TEXT NOT NULL, status TEXT NOT NULL, requester_user_id TEXT NOT NULL, target_department TEXT NOT NULL, details TEXT NOT NULL, submitted_at TIMESTAMPTZ NOT NULL, reviewed_by TEXT, reviewed_at TIMESTAMPTZ);
      CREATE TABLE IF NOT EXISTS notifications (id TEXT PRIMARY KEY, user_id TEXT, category TEXT NOT NULL, title TEXT NOT NULL, detail TEXT NOT NULL, severity TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL, link TEXT NOT NULL, read_at TIMESTAMPTZ);
    `);
  await client.query("ALTER TABLE app_users ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0");
}

async function clearSeedTables(client) {
  for (const table of ["notifications", "approval_requests", "utilization_trend", "hooters", "beacons", "rfid_tags", "security_logs", "maintenance_schedules", "repair_tickets", "movement_logs", "checkout_logs", "activities", "assets", "app_users", "departments"]) {
    await client.query(`DELETE FROM ${table}`);
  }
}

async function insertSeedData(client) {
  for (const department of seededDepartments) {
    await client.query("INSERT INTO departments (id, name, head_name, floor, extension, budget, mission) VALUES ($1, $2, $3, $4, $5, $6, $7)", [department.id, department.name, department.head, department.floor, department.extension, department.budget, department.mission]);
  }
  for (const user of seededUsers) {
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    await client.query("INSERT INTO app_users (id, full_name, email, password_hash, department, position, role_key, role_label, permissions, must_change_password, can_manage_users, can_approve_requests, can_see_all_data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, $10, $11, $12)", [user.id, user.fullName, user.email, passwordHash, user.department, user.position, user.roleKey, user.roleLabel, user.permissions, user.canManageUsers, user.canApproveRequests, user.canSeeAllData]);
  }
  for (const asset of seededAssets) {
    await client.query("INSERT INTO assets (id, name, type, department, assigned_to, purchase_date, warranty_expiry, status, location, value, verification_status, lifecycle_status, serial, vendor, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)", [asset.id, asset.name, asset.type, asset.department, asset.assignedTo, asset.purchaseDate, asset.warrantyExpiry, asset.status, asset.location, asset.value, asset.verificationStatus, asset.lifecycleStatus, asset.serial, asset.vendor, asset.notes]);
  }
  for (const activity of seededActivities) await client.query("INSERT INTO activities (id, title, detail, timestamp) VALUES ($1, $2, $3, $4)", [activity.id, activity.title, activity.detail, activity.timestamp]);
  for (const log of seededCheckoutLogs) await client.query("INSERT INTO checkout_logs (id, asset_id, asset_name, person, department, checked_out_at, expected_return, checked_in_at, status, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [log.id, log.assetId, log.assetName, log.person, log.department, log.checkedOutAt, log.expectedReturn, log.checkedInAt, log.status, log.location]);
  for (const log of seededMovementLogs) await client.query('INSERT INTO movement_logs (id, asset_id, asset_name, "from", "to", moved_by, timestamp, type, approval_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [log.id, log.assetId, log.assetName, log.from, log.to, log.movedBy, log.timestamp, log.type, log.approvalStatus]);
  for (const ticket of seededRepairTickets) await client.query("INSERT INTO repair_tickets (id, asset_id, asset_name, issue, technician, status, opened_at, eta, cost, priority) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [ticket.id, ticket.assetId, ticket.assetName, ticket.issue, ticket.technician, ticket.status, ticket.openedAt, ticket.eta, ticket.cost, ticket.priority]);
  for (const schedule of seededMaintenanceSchedules) await client.query("INSERT INTO maintenance_schedules (id, asset_id, asset_name, department, due_date, status, cadence) VALUES ($1, $2, $3, $4, $5, $6, $7)", [schedule.id, schedule.assetId, schedule.assetName, schedule.department, schedule.dueDate, schedule.status, schedule.cadence]);
  for (const log of seededSecurityLogs) await client.query("INSERT INTO security_logs (id, asset_id, asset_name, verified_by, method, location, timestamp, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [log.id, log.assetId, log.assetName, log.verifiedBy, log.method, log.location, log.timestamp, log.status]);
  for (const tag of seededPassiveDevices.rfidTags) await client.query("INSERT INTO rfid_tags (id, asset_id, location, battery, last_ping) VALUES ($1, $2, $3, $4, $5)", [tag.id, tag.assetId, tag.location, tag.battery, tag.lastPing]);
  for (const beacon of seededPassiveDevices.beacons) await client.query("INSERT INTO beacons (id, zone, last_seen, signal_strength) VALUES ($1, $2, $3, $4)", [beacon.id, beacon.zone, beacon.lastSeen, beacon.signalStrength]);
  for (const hooter of seededPassiveDevices.hooters) await client.query("INSERT INTO hooters (id, location, last_triggered, severity) VALUES ($1, $2, $3, $4)", [hooter.id, hooter.location, hooter.lastTriggered, hooter.severity]);
  for (const point of seededDashboardSnapshots) await client.query("INSERT INTO utilization_trend (month, active, maintenance, alerts, sort_order) VALUES ($1, $2, $3, $4, $5)", [point.month, point.active, point.maintenance, point.alerts, seededDashboardSnapshots.indexOf(point)]);
  for (const request of seededRequests) await client.query("INSERT INTO approval_requests (id, title, request_type, status, requester_user_id, target_department, details, submitted_at, reviewed_by, reviewed_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [request.id, request.title, request.requestType, request.status, request.requesterUserId, request.targetDepartment, request.details, request.submittedAt, request.reviewedBy, request.reviewedAt]);
  for (const notification of seededNotifications) await client.query("INSERT INTO notifications (id, user_id, category, title, detail, severity, created_at, link, read_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NULL)", [notification.id, notification.userId, notification.category, notification.title, notification.detail, notification.severity, notification.createdAt, notification.link]);
}

async function hasExistingData(client) {
  const result = await client.query("SELECT EXISTS (SELECT 1 FROM app_users LIMIT 1) AS seeded");
  return result.rows[0]?.seeded === true;
}

async function normalizeEmailDomains(client) {
  await client.query("UPDATE app_users SET email = REPLACE(email, '@susalabs.local', '@susalabs.com') WHERE email LIKE '%@susalabs.local'");
}

export async function initializeDatabase() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await createSchema(client);
    if (!(await hasExistingData(client))) {
      await insertSeedData(client);
    }
    await normalizeEmailDomains(client);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function seedDatabase() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await createSchema(client);
    await clearSeedTables(client);
    await insertSeedData(client);
    await normalizeEmailDomains(client);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function runSeedFromCli(processArgv) {
  if (!processArgv[1] || import.meta.url !== pathToFileURL(processArgv[1]).href) {
    return;
  }
  try {
    await seedDatabase();
    console.log("Database seeded with sample RFID System data.");
  } catch (error) {
    console.error("Failed to seed database:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
