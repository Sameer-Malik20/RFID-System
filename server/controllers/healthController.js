import { pingDatabase } from "../models/workspaceModel.js";

export async function getHealth(_req, res) {
  await pingDatabase();
  res.json({ ok: true });
}
