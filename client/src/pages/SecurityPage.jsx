import { useState } from "react";
import { Barcode, QrCode, ShieldAlert, ShieldCheck } from "lucide-react";
import { AsyncButton } from "../components/AsyncButton";
import { DataTable } from "../components/DataTable";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { formatDateTime } from "../lib/formatters";

export function SecurityPage({ assets, employees, securityLogs, onRunSecurityScan }) {
  const [scanDraft, setScanDraft] = useState({
    assetId: assets[0]?.id ?? "",
    method: "QR Scan",
    location: assets[0]?.location ?? "",
    verifiedBy: employees[0]?.name ?? "",
  });
  const [scanLoading, setScanLoading] = useState("");

  const selectedAsset = assets.find((entry) => entry.id === scanDraft.assetId) ?? assets[0];

  const columns = [
    { key: "assetName", label: "Asset" },
    { key: "verifiedBy", label: "Verified By" },
    { key: "method", label: "Method" },
    { key: "location", label: "Location" },
    { key: "timestamp", label: "Timestamp", render: (row) => formatDateTime(row.timestamp), sortValue: (row) => row.timestamp },
    { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
  ];

  async function simulateScan(method) {
    setScanLoading(method);
    try {
      await onRunSecurityScan({
        ...scanDraft,
        method,
      });
    } finally {
      setScanLoading("");
    }
  }

  return (
    <div className="space-y-8 page-enter">
      <SectionHeader
        eyebrow="Security"
        title="Verification and movement security"
        description="Simulate scans, verify assets, and surface unauthorized movement events before they turn into audit issues."
      />

      <div className="grid gap-5 md:grid-cols-3">
        <div className="panel-alt">
          <ShieldCheck className="size-5 text-emerald-600" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{securityLogs.filter((entry) => entry.status === "Verified").length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Verified security checks in the current dataset.</p>
        </div>
        <div className="panel-alt">
          <ShieldAlert className="size-5 text-rose-600" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{securityLogs.filter((entry) => entry.status !== "Verified").length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Exceptions requiring a review or secondary scan.</p>
        </div>
        <div className="panel-alt">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">Unauthorized Movement</p>
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">1</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Generator 10KVA triggered a flagged RFID scan in utility yard.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="panel min-w-0">
          <div className="rounded-[1.7rem] border border-[var(--color-brand-200)] bg-[linear-gradient(135deg,rgba(12,111,168,0.10),rgba(255,255,255,0.92)_46%,rgba(16,36,63,0.04))] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-600)]">Scanner Simulation</p>
            <h2 className="mt-2 font-display text-2xl text-[var(--color-ink-950)]">Run a verification event</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-ink-500)]">
              Simulate a live QR or barcode verification and immediately log the result into the security register.
            </p>

            <div className="mt-5 grid gap-4 rounded-[1.5rem] border border-white/80 bg-white/88 p-4 lg:grid-cols-2 2xl:grid-cols-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">Selected Asset</p>
                <p className="mt-2 break-words font-semibold text-[var(--color-ink-950)]">{selectedAsset?.name}</p>
                <p className="mt-1 break-all text-sm text-[var(--color-ink-500)]">{scanDraft.assetId}</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">Current Status</p>
                <div className="mt-2">
                  <StatusBadge value={selectedAsset?.verificationStatus ?? "Unverified"} />
                </div>
              </div>
              <div className="min-w-0 lg:col-span-2 2xl:col-span-1">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">Location Context</p>
                <p className="mt-2 break-words text-sm leading-6 text-[var(--color-ink-500)]">{scanDraft.location}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-4 2xl:grid-cols-2">
              <label className="min-w-0 space-y-2">
                <span className="text-sm font-semibold text-[var(--color-ink-700)]">Asset</span>
                <select
                  className="select-field"
                  value={scanDraft.assetId}
                  onChange={(event) => {
                    const asset = assets.find((entry) => entry.id === event.target.value);
                    setScanDraft({
                      ...scanDraft,
                      assetId: event.target.value,
                      location: asset?.location ?? scanDraft.location,
                    });
                  }}
                >
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.id} | {asset.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="min-w-0 space-y-2">
                <span className="text-sm font-semibold text-[var(--color-ink-700)]">Operator</span>
                <select
                  className="select-field"
                  value={scanDraft.verifiedBy}
                  onChange={(event) => setScanDraft({ ...scanDraft, verifiedBy: event.target.value })}
                >
                  {employees.map((employee) => (
                    <option key={employee.id}>{employee.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="min-w-0 space-y-2">
              <span className="text-sm font-semibold text-[var(--color-ink-700)]">Location</span>
              <input
                className="field"
                value={scanDraft.location}
                onChange={(event) => setScanDraft({ ...scanDraft, location: event.target.value })}
              />
            </label>

            <div className="grid gap-3 xl:grid-cols-2">
              <AsyncButton
                type="button"
                loading={scanLoading === "QR Scan"}
                className="min-w-0 justify-start rounded-[1.4rem] border border-[var(--color-shell-950)] bg-[var(--color-shell-950)] px-5 py-4 text-left text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-700)] focus:outline-none focus:ring-4 focus:ring-[rgba(12,111,168,0.14)]"
                onClick={() => simulateScan("QR Scan")}
              >
                <div className="flex items-start gap-3">
                  <div className="inline-flex size-10 items-center justify-center rounded-[1rem] bg-white/10">
                    <QrCode className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold">Run QR scan</p>
                    <p className="mt-1 text-sm leading-6 text-white/70">Best for quick fixed-point verification gates.</p>
                  </div>
                </div>
              </AsyncButton>
              <AsyncButton
                type="button"
                variant="secondary"
                loading={scanLoading === "Barcode Scan"}
                className="min-w-0 justify-start rounded-[1.4rem] border border-[var(--color-line)] bg-white px-5 py-4 text-left text-[var(--color-ink-700)] transition hover:-translate-y-0.5 hover:border-[var(--color-brand-200)] hover:bg-[var(--color-brand-50)] focus:outline-none focus:ring-4 focus:ring-[rgba(12,111,168,0.10)]"
                onClick={() => simulateScan("Barcode Scan")}
              >
                <div className="flex items-start gap-3">
                  <div className="inline-flex size-10 items-center justify-center rounded-[1rem] bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
                    <Barcode className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--color-ink-950)]">Run barcode scan</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-ink-500)]">Use for dock-side and handheld verification workflows.</p>
                  </div>
                </div>
              </AsyncButton>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <DataTable
            title="Security check logs"
            description="Who scanned what, when, where, and whether the verification passed."
            rows={securityLogs}
            columns={columns}
            searchableFields={["assetName", "verifiedBy", "method", "location", "status"]}
          />
        </div>
      </div>
    </div>
  );
}
