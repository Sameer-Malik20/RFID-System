import { Gauge, ShieldAlert } from "lucide-react";
import { DataTable } from "../components/DataTable";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { calculateAgeYears, formatDate, getLifecycleRecommendation } from "../lib/formatters";

export function LifecyclePage({ assets }) {
  const rows = assets.map((asset) => ({
    ...asset,
    ageYears: calculateAgeYears(asset.purchaseDate),
    recommendation: getLifecycleRecommendation(asset),
  }));

  const columns = [
    { key: "name", label: "Asset" },
    { key: "ageYears", label: "Age", render: (row) => `${row.ageYears} years`, sortValue: (row) => row.ageYears },
    { key: "warrantyExpiry", label: "Warranty", render: (row) => formatDate(row.warrantyExpiry), sortValue: (row) => row.warrantyExpiry },
    { key: "lifecycleStatus", label: "Condition", render: (row) => <StatusBadge value={row.lifecycleStatus} /> },
    { key: "recommendation", label: "Recommendation", cellClassName: "max-w-xs" },
  ];

  return (
    <div className="space-y-8 page-enter">
      <SectionHeader
        eyebrow="Aging & Lifecycle"
        title="Lifecycle and depreciation posture"
        description="See asset age, lifecycle health, warranty exposure, and replacement recommendations before service risk compounds."
      />

      <div className="grid gap-5 md:grid-cols-3">
        <div className="panel-alt">
          <Gauge className="size-5 text-[var(--color-brand-700)]" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{rows.filter((asset) => asset.ageYears >= 4).length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Assets older than four years and approaching refresh review.</p>
        </div>
        <div className="panel-alt">
          <ShieldAlert className="size-5 text-rose-600" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{rows.filter((asset) => asset.lifecycleStatus === "End of Life").length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Assets already marked end-of-life.</p>
        </div>
        <div className="panel-alt">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">Warranty Expiring</p>
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">
            {rows.filter((asset) => new Date(asset.warrantyExpiry) < new Date("2026-06-01")).length}
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Assets requiring support extension or renewal.</p>
        </div>
      </div>

      <DataTable
        title="Lifecycle register"
        description="Operational aging, depreciation posture, and action guidance for every asset."
        rows={rows}
        columns={columns}
        searchableFields={["id", "name", "department", "recommendation", "lifecycleStatus", "status"]}
      />
    </div>
  );
}
