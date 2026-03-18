import { randomUUID } from "node:crypto";
import { withTransaction } from "../config/database.js";
import { findAssetById, findCheckoutLogById, insertActivity, insertAsset, insertMovementLog, insertRepairTicket, insertSecurityLog, updateAsset, updateAssetLocationAndDepartment, updateAssetVerificationStatus, checkInCheckoutLog } from "../models/assetModel.js";
import { assertAssetAccess, assertCheckoutAccess, assertDepartmentWriteAccess } from "../services/accessControlService.js";

export async function createAsset(req, res) {
  assertDepartmentWriteAccess(req.user, req.body?.department ?? req.user.department);
  await insertAsset(req.body ?? {});
  await insertActivity({ id: randomUUID(), title: `${req.body.name} added`, detail: `${req.user.fullName} created a new asset record.`, timestamp: new Date().toISOString() });
  res.json({ ok: true });
}

export async function updateAssetById(req, res) {
  const currentAsset = await findAssetById(req.params.assetId);
  if (!currentAsset) {
    return res.status(404).json({ message: "Asset not found." });
  }
  assertAssetAccess(req.user, currentAsset);
  if ((req.body?.department ?? currentAsset.department) !== currentAsset.department) {
    assertDepartmentWriteAccess(req.user, req.body.department);
  }
  await updateAsset(req.params.assetId, req.body ?? {});
  res.json({ ok: true });
}

export async function checkInAsset(req, res) {
  const checkoutLog = await findCheckoutLogById(req.params.logId);
  if (!checkoutLog) {
    return res.status(404).json({ message: "Checkout log not found." });
  }
  const asset = await findAssetById(checkoutLog.assetId);
  assertCheckoutAccess(req.user, checkoutLog, asset);
  await checkInCheckoutLog(req.params.logId, new Date().toISOString());
  res.json({ ok: true });
}

export async function transferAsset(req, res) {
  const { assetId, toDepartment, toLocation } = req.body ?? {};
  const asset = await findAssetById(assetId);
  if (!asset) {
    return res.status(404).json({ message: "Asset not found." });
  }
  assertAssetAccess(req.user, asset);
  assertDepartmentWriteAccess(req.user, toDepartment ?? asset.department);

  await updateAssetLocationAndDepartment(assetId, toDepartment, toLocation);
  await insertMovementLog({ id: randomUUID(), assetId, assetName: asset.name, from: asset.location, to: toLocation, movedBy: req.user.fullName, timestamp: new Date().toISOString(), type: "Department Transfer", approvalStatus: "Approved" });
  res.json({ ok: true });
}

export async function createRepairTicket(req, res) {
  const { assetId, issue, technician, eta, cost, priority } = req.body ?? {};
  const asset = await findAssetById(assetId);
  if (!asset) {
    return res.status(404).json({ message: "Asset not found." });
  }
  assertAssetAccess(req.user, asset);
  await insertRepairTicket({ id: randomUUID(), assetId, assetName: asset?.name ?? assetId, issue, technician, openedAt: new Date().toISOString().slice(0, 10), eta, cost, priority });
  res.json({ ok: true });
}

export async function createSecurityScan(req, res) {
  const { assetId, method, location } = req.body ?? {};
  const asset = await findAssetById(assetId);
  if (!asset) {
    return res.status(404).json({ message: "Asset not found." });
  }
  assertAssetAccess(req.user, asset);
  const status = asset.status === "Aging" || asset.verificationStatus === "Flagged" ? "Flagged" : "Verified";
  await insertSecurityLog({ id: randomUUID(), assetId: asset.id, assetName: asset.name, verifiedBy: req.user.fullName, method, location, timestamp: new Date().toISOString(), status });
  await updateAssetVerificationStatus(asset.id, status);
  res.json({ ok: true });
}

export async function importAssets(req, res) {
  const assets = Array.isArray(req.body?.assets) ? req.body.assets : [];
  if (!assets.length) {
    return res.status(400).json({ message: "Provide at least one asset to import." });
  }

  await withTransaction(async (client) => {
    for (const asset of assets) {
      if (!asset.id || !asset.name || !asset.department || !asset.status) {
        const error = new Error(`Asset ${asset.id || asset.name || "unknown"} is missing required fields.`);
        error.status = 400;
        throw error;
      }

      assertDepartmentWriteAccess(req.user, asset.department);
      const existingAsset = await findAssetById(asset.id, client);
      if (existingAsset) {
        assertAssetAccess(req.user, existingAsset);
        await updateAsset(asset.id, asset, client);
      } else {
        await insertAsset(asset, client);
      }
    }

    await insertActivity(
      {
        id: randomUUID(),
        title: `${assets.length} assets imported`,
        detail: `${req.user.fullName} completed an atomic bulk import through the assets module.`,
        timestamp: new Date().toISOString(),
      },
      client,
    );
  });

  res.json({ ok: true, imported: assets.length });
}
