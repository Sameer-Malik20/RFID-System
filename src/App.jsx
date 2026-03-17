import { lazy, Suspense, useState } from "react";
import { Route, Routes } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AppShell } from "./components/AppShell";
import {
  assets as seedAssets,
  checkoutLogs as seedCheckoutLogs,
  departments,
  employees,
  maintenanceSchedules as seedMaintenanceSchedules,
  movementLogs as seedMovementLogs,
  passiveDevices,
  recentActivities,
  repairTickets as seedRepairTickets,
  securityLogs as seedSecurityLogs,
  utilizationTrend,
} from "./data/sampleData";

const DashboardPage = lazy(() => import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const AssetsPage = lazy(() => import("./pages/AssetsPage").then((module) => ({ default: module.AssetsPage })));
const AssetDetailPage = lazy(() => import("./pages/AssetDetailPage").then((module) => ({ default: module.AssetDetailPage })));
const DepartmentsPage = lazy(() => import("./pages/DepartmentsPage").then((module) => ({ default: module.DepartmentsPage })));
const AssetLogsPage = lazy(() => import("./pages/AssetLogsPage").then((module) => ({ default: module.AssetLogsPage })));
const MovementLogsPage = lazy(() => import("./pages/MovementLogsPage").then((module) => ({ default: module.MovementLogsPage })));
const MaintenancePage = lazy(() => import("./pages/MaintenancePage").then((module) => ({ default: module.MaintenancePage })));
const LifecyclePage = lazy(() => import("./pages/LifecyclePage").then((module) => ({ default: module.LifecyclePage })));
const PassiveDevicesPage = lazy(() => import("./pages/PassiveDevicesPage").then((module) => ({ default: module.PassiveDevicesPage })));
const SecurityPage = lazy(() => import("./pages/SecurityPage").then((module) => ({ default: module.SecurityPage })));

function nowStamp() {
  return new Date().toISOString();
}

function findAssetName(assets, assetId) {
  return assets.find((asset) => asset.id === assetId)?.name ?? assetId;
}

export default function App() {
  const [assets, setAssets] = useState(structuredClone(seedAssets));
  const [activities, setActivities] = useState(structuredClone(recentActivities));
  const [checkoutLogs, setCheckoutLogs] = useState(structuredClone(seedCheckoutLogs));
  const [movementLogs, setMovementLogs] = useState(structuredClone(seedMovementLogs));
  const [repairTickets, setRepairTickets] = useState(structuredClone(seedRepairTickets));
  const [maintenanceSchedules] = useState(structuredClone(seedMaintenanceSchedules));
  const [securityLogs, setSecurityLogs] = useState(structuredClone(seedSecurityLogs));

  function prependActivity(title, detail) {
    setActivities((current) => [
      {
        id: crypto.randomUUID(),
        title,
        detail,
        timestamp: nowStamp(),
      },
      ...current,
    ]);
  }

  function handleSaveAsset(nextAsset) {
    setAssets((current) => {
      const exists = current.some((asset) => asset.id === nextAsset.id);
      const output = exists
        ? current.map((asset) => (asset.id === nextAsset.id ? { ...asset, ...nextAsset } : asset))
        : [{ ...nextAsset }, ...current];

      prependActivity(
        exists ? `${nextAsset.name} updated` : `${nextAsset.name} added`,
        exists ? "Asset profile, status, or assignment details were revised." : "New asset record was added to the enterprise register.",
      );

      toast.success(exists ? "Asset updated." : "Asset created.");
      return output;
    });
  }

  function handleTransferAsset({ assetId, toDepartment, toLocation, approvedBy }) {
    const movedAssetName = findAssetName(assets, assetId);

    setAssets((current) =>
      current.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              department: toDepartment,
              location: toLocation,
            }
          : asset,
      ),
    );

    setMovementLogs((current) => [
      {
        id: crypto.randomUUID(),
        assetId,
        assetName: movedAssetName,
        from: assets.find((asset) => asset.id === assetId)?.location ?? "Unknown",
        to: toLocation,
        movedBy: approvedBy,
        timestamp: nowStamp(),
        type: "Department Transfer",
        approvalStatus: "Approved",
      },
      ...current,
    ]);

    prependActivity(`${movedAssetName} transferred to ${toDepartment}`, `Approval recorded by ${approvedBy}.`);
    toast.success("Asset transfer approved.");
  }

  function handleCheckInAsset(logId) {
    const activeLog = checkoutLogs.find((entry) => entry.id === logId);
    if (!activeLog) {
      return;
    }

    setCheckoutLogs((current) =>
      current.map((entry) =>
        entry.id === logId
          ? {
              ...entry,
              checkedInAt: nowStamp(),
              status: "Completed",
            }
          : entry,
      ),
    );

    setAssets((current) =>
      current.map((asset) =>
        asset.id === activeLog.assetId
          ? {
              ...asset,
              status: "Active",
              location: `${activeLog.department} Asset Desk`,
            }
          : asset,
      ),
    );

    prependActivity(`${activeLog.assetName} checked in`, `${activeLog.person} completed return at ${activeLog.department}.`);
    toast.success("Asset checked in.");
  }

  function handleCreateRepairTicket(ticketDraft) {
    const assetName = findAssetName(assets, ticketDraft.assetId);

    setRepairTickets((current) => [
      {
        id: crypto.randomUUID(),
        assetId: ticketDraft.assetId,
        assetName,
        issue: ticketDraft.issue,
        technician: ticketDraft.technician,
        status: "Pending",
        openedAt: nowStamp().slice(0, 10),
        eta: ticketDraft.eta,
        cost: ticketDraft.cost,
        priority: ticketDraft.priority,
      },
      ...current,
    ]);

    setAssets((current) =>
      current.map((asset) =>
        asset.id === ticketDraft.assetId
          ? {
              ...asset,
              status: asset.status === "Active" ? "Under Repair" : asset.status,
            }
          : asset,
      ),
    );

    prependActivity(`Repair ticket opened for ${assetName}`, `Assigned to ${ticketDraft.technician} with ${ticketDraft.priority.toLowerCase()} priority.`);
    toast.success("Repair ticket created.");
  }

  function handleSecurityScan(scanDraft) {
    const asset = assets.find((entry) => entry.id === scanDraft.assetId);
    if (!asset) {
      return;
    }

    const status = asset.status === "Aging" || asset.verificationStatus === "Flagged" ? "Flagged" : "Verified";

    setSecurityLogs((current) => [
      {
        id: crypto.randomUUID(),
        assetId: asset.id,
        assetName: asset.name,
        verifiedBy: scanDraft.verifiedBy,
        method: scanDraft.method,
        location: scanDraft.location,
        timestamp: nowStamp(),
        status,
      },
      ...current,
    ]);

    setAssets((current) =>
      current.map((entry) =>
        entry.id === asset.id
          ? {
              ...entry,
              verificationStatus: status,
            }
          : entry,
      ),
    );

    prependActivity(`${asset.name} scanned via ${scanDraft.method}`, `${scanDraft.verifiedBy} completed security verification at ${scanDraft.location}.`);
    toast.success(status === "Verified" ? "Asset verified successfully." : "Scan flagged for review.");
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "18px",
            border: "1px solid rgba(206, 219, 235, 0.85)",
            padding: "14px 16px",
            background: "rgba(255,255,255,0.94)",
            color: "#10243f",
          },
        }}
      />
      <AppShell>
        <Suspense
          fallback={
            <div className="panel page-enter">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-brand-600)]">Loading module</p>
              <h2 className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">Preparing enterprise workspace...</h2>
              <p className="mt-2 text-sm text-[var(--color-ink-500)]">Pulling charts, tables, and verification surfaces into view.</p>
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  assets={assets}
                  departments={departments}
                  activities={activities}
                  checkoutLogs={checkoutLogs}
                  maintenanceSchedules={maintenanceSchedules}
                  securityLogs={securityLogs}
                  utilizationTrend={utilizationTrend}
                />
              }
            />
            <Route path="/assets" element={<AssetsPage assets={assets} employees={employees} onSaveAsset={handleSaveAsset} />} />
            <Route
              path="/assets/:assetId"
              element={<AssetDetailPage assets={assets} movementLogs={movementLogs} repairTickets={repairTickets} passiveDevices={passiveDevices} />}
            />
            <Route path="/departments" element={<DepartmentsPage departments={departments} assets={assets} onTransferAsset={handleTransferAsset} />} />
            <Route path="/asset-logs" element={<AssetLogsPage checkoutLogs={checkoutLogs} onCheckInAsset={handleCheckInAsset} />} />
            <Route path="/movement-logs" element={<MovementLogsPage movementLogs={movementLogs} assets={assets} />} />
            <Route
              path="/maintenance"
              element={<MaintenancePage assets={assets} repairTickets={repairTickets} maintenanceSchedules={maintenanceSchedules} onCreateRepairTicket={handleCreateRepairTicket} />}
            />
            <Route path="/lifecycle" element={<LifecyclePage assets={assets} />} />
            <Route path="/passive-devices" element={<PassiveDevicesPage assets={assets} passiveDevices={passiveDevices} />} />
            <Route
              path="/security"
              element={<SecurityPage assets={assets} employees={employees} securityLogs={securityLogs} onRunSecurityScan={handleSecurityScan} />}
            />
          </Routes>
        </Suspense>
      </AppShell>
    </>
  );
}
