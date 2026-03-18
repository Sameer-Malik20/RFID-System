import { findNotificationById, markNotificationRead } from "../models/notificationModel.js";

export async function markRead(req, res) {
  const notification = await findNotificationById(req.params.notificationId);
  if (!notification || notification.userId !== req.user.id) {
    return res.status(404).json({ message: "Notification not found." });
  }

  await markNotificationRead(req.params.notificationId, req.user.id, new Date().toISOString());
  res.json({ ok: true });
}
