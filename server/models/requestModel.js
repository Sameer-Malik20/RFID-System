import { query } from "../config/database.js";

export async function createRequest(request) {
  await query("INSERT INTO approval_requests (id, title, request_type, status, requester_user_id, target_department, details, submitted_at, reviewed_by, reviewed_at) VALUES ($1, $2, $3, 'Pending', $4, $5, $6, $7, NULL, NULL)", [request.id, request.title, request.requestType, request.requesterUserId, request.targetDepartment, request.details, request.submittedAt]);
}

export async function findRequestById(requestId) {
  const result = await query('SELECT id, title, requester_user_id AS "requesterUserId" FROM approval_requests WHERE id = $1', [requestId]);
  return result.rows[0] ?? null;
}

export async function approveRequest(requestId, reviewer, reviewedAt) {
  await query("UPDATE approval_requests SET status = 'Approved', reviewed_by = $1, reviewed_at = $2 WHERE id = $3", [reviewer, reviewedAt, requestId]);
}
