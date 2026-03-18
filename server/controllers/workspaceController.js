import { buildSearchIndex, filterDatasetForUser, getWorkspaceDataset, getWorkspacePayload } from "../services/workspaceService.js";

export async function getBootstrap(req, res) {
  const payload = await getWorkspacePayload(req.user);
  res.json(payload);
}

export async function getSearch(req, res) {
  const dataset = await getWorkspaceDataset();
  const filtered = filterDatasetForUser(req.user, dataset);
  const queryValue = String(req.query.q ?? "").trim().toLowerCase();
  const results = buildSearchIndex(filtered).filter((entry) => `${entry.title} ${entry.subtitle} ${entry.kind}`.toLowerCase().includes(queryValue)).slice(0, 12);
  res.json({ results });
}
