import { randomUUID } from "node:crypto";
import { createNotification } from "../models/notificationModel.js";
import { findRequestById, createRequest as insertRequest, approveRequest as markApproved } from "../models/requestModel.js";
import { filterDatasetForUser, getWorkspaceDataset } from "../services/workspaceService.js";

export async function getRequests(req, res) {
  const dataset = await getWorkspaceDataset();
  const filtered = filterDatasetForUser(req.user, dataset);
  res.json({ requests: filtered.requests });
}

export async function createRequest(req, res) {
  const { title, requestType, details, targetDepartment } = req.body ?? {};
  const submittedAt = new Date().toISOString();
  await insertRequest({ id: randomUUID(), title, requestType, requesterUserId: req.user.id, targetDepartment: targetDepartment ?? req.user.department, details, submittedAt });
  await createNotification({ id: randomUUID(), userId: "usr-super-1", category: "Request", title, detail: details, severity: "medium", createdAt: submittedAt, link: "/requests" });
  res.json({ ok: true });
}

export async function approveRequest(req, res) {
  const request = await findRequestById(req.params.requestId);
  if (!request) {
    return res.status(404).json({ message: "Request not found." });
  }
  const reviewedAt = new Date().toISOString();
  await markApproved(req.params.requestId, req.user.fullName, reviewedAt);
  await createNotification({ id: randomUUID(), userId: request.requesterUserId, category: "Approval", title: `${request.title} approved`, detail: `Approved by ${req.user.fullName}.`, severity: "low", createdAt: reviewedAt, link: "/requests" });
  res.json({ ok: true });
}
