import { query } from "../config/database.js";

const publicFields = 'id, full_name AS "fullName", email, department, position, role_key AS "roleKey", role_label AS "roleLabel", permissions, must_change_password AS "mustChangePassword", can_manage_users AS "canManageUsers", can_approve_requests AS "canApproveRequests", can_see_all_data AS "canSeeAllData"';
const privateFields = `${publicFields}, password_hash AS "passwordHash", token_version AS "tokenVersion"`;

export async function findUserByEmail(email) {
  const result = await query(`SELECT ${privateFields} FROM app_users WHERE email = $1`, [email.toLowerCase()]);
  return result.rows[0] ?? null;
}

export async function findUserById(id) {
  const result = await query(`SELECT ${privateFields} FROM app_users WHERE id = $1`, [id]);
  return result.rows[0] ?? null;
}

export async function listUsers() {
  const result = await query(`SELECT ${publicFields} FROM app_users ORDER BY department, full_name`);
  return result.rows;
}

export async function createUser(user) {
  await query(
    "INSERT INTO app_users (id, full_name, email, password_hash, department, position, role_key, role_label, permissions, must_change_password, can_manage_users, can_approve_requests, can_see_all_data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, $10, $11, $12)",
    [
      user.id,
      user.fullName,
      user.email.toLowerCase(),
      user.passwordHash,
      user.department,
      user.position,
      user.roleKey,
      user.roleLabel,
      user.permissions,
      Boolean(user.canManageUsers),
      Boolean(user.canApproveRequests),
      Boolean(user.canSeeAllData),
    ],
  );
}

export async function updateUser(userId, user) {
  await query(
    "UPDATE app_users SET full_name = $1, email = $2, department = $3, position = $4, role_key = $5, role_label = $6, permissions = $7, can_manage_users = $8, can_approve_requests = $9, can_see_all_data = $10 WHERE id = $11",
    [
      user.fullName,
      user.email.toLowerCase(),
      user.department,
      user.position,
      user.roleKey,
      user.roleLabel,
      user.permissions,
      Boolean(user.canManageUsers),
      Boolean(user.canApproveRequests),
      Boolean(user.canSeeAllData),
      userId,
    ],
  );
}

export async function updatePassword(userId, passwordHash) {
  const result = await query(`UPDATE app_users SET password_hash = $1, must_change_password = FALSE, token_version = token_version + 1 WHERE id = $2 RETURNING ${privateFields}`, [
    passwordHash,
    userId,
  ]);
  return result.rows[0] ?? null;
}

export function sanitizeUser(user) {
  const { passwordHash, tokenVersion, ...safeUser } = user;
  return safeUser;
}
