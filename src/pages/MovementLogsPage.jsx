import { useState } from "react";
import { ArrowRightLeft, Route, ShieldCheck } from "lucide-react";
import { DataTable } from "../components/DataTable";
import { SectionHeader } from "../components/SectionHeader";
import { Timeline } from "../components/Timeline";
import { StatusBadge } from "../components/StatusBadge";
import { formatDateTime } from "../lib/formatters";

export function MovementLogsPage({ movementLogs, assets }) {
  const [selectedAssetId, setSelectedAssetId] = useState("All");

  const rows = movementLogs.filter((entry) => selectedAssetId === "All" || entry.assetId === selectedAssetId);
  const timelineItems = rows.map((entry) => ({
    id: entry.id,
    title: `${entry.assetName}: ${entry.from} -> ${entry.to}`,
    description: `Movement type ${entry.type}. Handled by ${entry.movedBy}.`,
    timestamp: entry.timestamp,
    status: entry.approvalStatus,
    meta: entry.assetId,
  }));

  const columns = [
    { key: "assetName", label: "Asset" },
    { key: "type", label: "Move Type" },
    { key: "movedBy", label: "Moved By" },
    { key: "to", label: "Destination" },
    { key: "timestamp", label: "Timestamp", render: (row) => formatDateTime(row.timestamp), sortValue: (row) => row.timestamp },
    { key: "approvalStatus", label: "Approval", render: (row) => <StatusBadge value={row.approvalStatus} /> },
  ];

  return (
    <div className="space-y-8 page-enter">
      <SectionHeader
        eyebrow="Movement Logs"
        title="Location and movement history"
        description="Every location change is recorded here with approvals, move type, and responsible custodian."
      />

      <div className="grid gap-5 md:grid-cols-3">
        <div className="panel-alt">
          <ArrowRightLeft className="size-5 text-[var(--color-brand-700)]" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{rows.length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Movement events in the active view.</p>
        </div>
        <div className="panel-alt">
          <ShieldCheck className="size-5 text-emerald-600" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{rows.filter((entry) => entry.approvalStatus === "Approved").length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Approved transfers and location changes.</p>
        </div>
        <div className="panel-alt">
          <Route className="size-5 text-amber-600" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{rows.filter((entry) => entry.approvalStatus === "Pending").length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Pending approvals waiting for operations review.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DataTable
          title="Movement register"
          description="Track approved and pending movement requests with full route history."
          rows={rows}
          columns={columns}
          searchableFields={["assetName", "assetId", "from", "to", "movedBy", "type"]}
          filters={
            <select value={selectedAssetId} onChange={(event) => setSelectedAssetId(event.target.value)} className="select-field min-w-56">
              <option value="All">All assets</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.id} | {asset.name}
                </option>
              ))}
            </select>
          }
        />

        <div className="panel">
          <div className="rounded-[1.7rem] border border-[var(--color-brand-200)] bg-[linear-gradient(135deg,rgba(12,111,168,0.10),rgba(255,255,255,0.94)_52%,rgba(16,36,63,0.04))] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-600)]">Timeline View</p>
            <h2 className="mt-2 font-display text-2xl text-[var(--color-ink-950)]">Movement chronology</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
              A readable sequence of custody changes, approvals, and route transitions for the selected movement scope.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">
              <span className="rounded-full border border-[var(--color-line)] bg-white px-3 py-2">Events {rows.length}</span>
              <span className="rounded-full border border-[var(--color-line)] bg-white px-3 py-2">
                Scope {selectedAssetId === "All" ? "All Assets" : selectedAssetId}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <Timeline items={timelineItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
