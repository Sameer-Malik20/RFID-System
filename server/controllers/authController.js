import { comparePassword, hashPassword, signToken } from "../utils/auth.js";
import { findUserByEmail, findUserById, sanitizeUser, updatePassword } from "../models/userModel.js";

export async function login(req, res) {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await findUserByEmail(email);
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  res.json({
    token: signToken({ userId: user.id, tokenVersion: user.tokenVersion }),
    user: sanitizeUser(user),
  });
}

export async function me(req, res) {
  res.json({ user: req.user });
}

export async function changePassword(req, res) {
  const { currentPassword, nextPassword } = req.body ?? {};
  if (!currentPassword || !nextPassword || nextPassword.length < 8) {
    return res.status(400).json({ message: "Provide current password and a stronger next password." });
  }

  const currentUser = await findUserById(req.user.id);
  if (!(await comparePassword(currentPassword, currentUser.passwordHash))) {
    return res.status(400).json({ message: "Current password is incorrect." });
  }

  const updatedUser = await updatePassword(req.user.id, await hashPassword(nextPassword));
  res.json({
    message: "Password updated successfully.",
    token: signToken({ userId: updatedUser.id, tokenVersion: updatedUser.tokenVersion }),
    user: sanitizeUser(updatedUser),
  });
}
