import { useState } from "react";
import { ArrowRightLeft, Building2, Users } from "lucide-react";
import { AsyncButton } from "../components/AsyncButton";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { formatCurrency } from "../lib/formatters";

export function DepartmentsPage({ departments, assets, onTransferAsset }) {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferDraft, setTransferDraft] = useState({
    assetId: assets[0]?.id ?? "",
    toDepartment: departments[0]?.name ?? "IT",
    toLocation: departments[0]?.floor ?? "",
    approvedBy: departments[0]?.head ?? "",
  });

  const departmentCards = departments.map((department) => {
    const count = assets.filter((asset) => asset.department === department.name).length;
    return {
      ...department,
      count,
    };
  });

  const rows = assets
    .filter((asset) => selectedDepartment === "All" || asset.department === selectedDepartment)
    .map((asset) => ({
      ...asset,
      head: departments.find((department) => department.name === asset.department)?.head ?? "Unassigned",
    }));

  const columns = [
    { key: "name", label: "Asset", render: (row) => <p className="font-semibold text-[var(--color-ink-950)]">{row.name}</p> },
    { key: "department", label: "Department" },
    { key: "head", label: "Department Head" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
  ];

  async function submitTransfer(event) {
    event.preventDefault();
    setTransferLoading(true);
    try {
      await onTransferAsset(transferDraft);
      setTransferOpen(false);
    } finally {
      setTransferLoading(false);
    }
  }

  return (
    <div className="space-y-8 page-enter">
      <SectionHeader
        eyebrow="Departments"
        title="Department intelligence"
        description="Track asset concentration by function, view department heads, and move inventory under approval controls."
        actions={
          <button type="button" className="primary-button" onClick={() => setTransferOpen(true)}>
            <ArrowRightLeft className="mr-2 size-4" />
            Transfer Asset
          </button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-5">
        {departmentCards.map((department) => (
          <div key={department.id} className="panel-alt">
            <Building2 className="size-5 text-[var(--color-brand-700)]" />
            <p className="mt-4 font-display text-2xl text-[var(--color-ink-950)]">{department.name}</p>
            <p className="mt-1 text-sm leading-6 text-[var(--color-ink-500)]">{department.mission}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-[var(--color-ink-500)]">
              <span>{department.count} assets</span>
              <span>{formatCurrency(department.budget)}</span>
            </div>
            <div className="mt-4 rounded-[1.3rem] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-ink-600)]">
              <p className="font-semibold text-[var(--color-ink-950)]">{department.head}</p>
              <p>{department.floor}</p>
            </div>
          </div>
        ))}
      </div>

      <DataTable
        title="Assets by department"
        description="Filter down to a department to inspect ownership spread and asset placement."
        rows={rows}
        columns={columns}
        searchableFields={["name", "department", "head", "location", "type"]}
        filters={
          <select value={selectedDepartment} onChange={(event) => setSelectedDepartment(event.target.value)} className="select-field min-w-40">
            {["All", ...departments.map((department) => department.name)].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        }
      />

      <Modal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        title="Transfer asset between departments"
        description="Capture approval and new custody location before moving inventory."
      >
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submitTransfer}>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-[var(--color-ink-700)]">Asset</span>
            <select
              className="select-field"
              value={transferDraft.assetId}
              onChange={(event) => setTransferDraft({ ...transferDraft, assetId: event.target.value })}
            >
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.id} • {asset.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--color-ink-700)]">To Department</span>
            <select
              className="select-field"
              value={transferDraft.toDepartment}
              onChange={(event) => {
                const department = departments.find((entry) => entry.name === event.target.value);
                setTransferDraft({
                  ...transferDraft,
                  toDepartment: event.target.value,
                  toLocation: department?.floor ?? transferDraft.toLocation,
                  approvedBy: department?.head ?? transferDraft.approvedBy,
                });
              }}
            >
              {departments.map((department) => (
                <option key={department.id} value={department.name}>
                  {department.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--color-ink-700)]">Approved By</span>
            <input
              className="field"
              value={transferDraft.approvedBy}
              onChange={(event) => setTransferDraft({ ...transferDraft, approvedBy: event.target.value })}
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-[var(--color-ink-700)]">New Location</span>
            <input
              className="field"
              value={transferDraft.toLocation}
              onChange={(event) => setTransferDraft({ ...transferDraft, toLocation: event.target.value })}
            />
          </label>
          <div className="md:col-span-2 flex justify-end gap-3">
            <button type="button" className="secondary-button" onClick={() => setTransferOpen(false)}>
              Cancel
            </button>
            <AsyncButton type="submit" loading={transferLoading}>
              Approve Transfer
            </AsyncButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
