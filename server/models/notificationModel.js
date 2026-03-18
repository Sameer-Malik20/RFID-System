import { query } from "../config/database.js";

export async function createNotification(notification) {
  await query("INSERT INTO notifications (id, user_id, category, title, detail, severity, created_at, link, read_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NULL)", [notification.id, notification.userId, notification.category, notification.title, notification.detail, notification.severity, notification.createdAt, notification.link]);
}

export async function findNotificationById(notificationId) {
  const result = await query('SELECT id, user_id AS "userId", read_at AS "readAt" FROM notifications WHERE id = $1', [notificationId]);
  return result.rows[0] ?? null;
}

export async function markNotificationRead(notificationId, userId, timestamp) {
  await query("UPDATE notifications SET read_at = $1 WHERE id = $2 AND user_id = $3", [timestamp, notificationId, userId]);
}
