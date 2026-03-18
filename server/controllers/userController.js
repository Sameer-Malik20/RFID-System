import { randomUUID } from "node:crypto";
import { createUser as insertUser, listUsers, updateUser as persistUserUpdate } from "../models/userModel.js";
import { hashPassword } from "../utils/auth.js";

export async function getUsers(_req, res) {
  res.json({ users: await listUsers() });
}

export async function createUser(req, res) {
  await insertUser({
    ...req.body,
    id: randomUUID(),
    passwordHash: await hashPassword("ChangeMe123"),
  });
  res.json({ ok: true });
}

export async function updateUser(req, res) {
  await persistUserUpdate(req.params.userId, req.body ?? {});
  res.json({ ok: true });
}
