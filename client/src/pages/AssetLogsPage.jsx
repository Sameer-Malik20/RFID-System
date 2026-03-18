import { useState } from "react";
import { Clock3, ShieldAlert } from "lucide-react";
import { AsyncButton } from "../components/AsyncButton";
import { DataTable } from "../components/DataTable";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { formatDateTime } from "../lib/formatters";

export function AssetLogsPage({ checkoutLogs, onCheckInAsset }) {
  const [department, setDepartment] = useState("All");
  const [person, setPerson] = useState("All");
  const [status, setStatus] = useState("All");
  const [checkingInId, setCheckingInId] = useState("");

  const rows = checkoutLogs.filter((entry) => {
    return (
      (department === "All" || entry.department === department) &&
      (person === "All" || entry.person === person) &&
      (status === "All" || entry.status === status)
    );
  });

  const columns = [
    { key: "assetName", label: "Asset" },
    { key: "person", label: "Custodian" },
    { key: "department", label: "Department" },
    { key: "checkedOutAt", label: "Checked Out", render: (row) => formatDateTime(row.checkedOutAt), sortValue: (row) => row.checkedOutAt },
    { key: "expectedReturn", label: "Expected Return", render: (row) => formatDateTime(row.expectedReturn), sortValue: (row) => row.expectedReturn },
    { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
    {
      key: "action",
      label: "Action",
      render: (row) =>
        row.checkedInAt ? (
          <span className="text-xs uppercase tracking-[0.22em] text-[var(--color-ink-400)]">Returned</span>
        ) : (
          <AsyncButton
            type="button"
            variant="secondary"
            className="!px-4 !py-2"
            loading={checkingInId === row.id}
            onClick={async () => {
              setCheckingInId(row.id);
              try {
                await onCheckInAsset(row.id);
              } finally {
                setCheckingInId("");
              }
            }}
          >
            Check In
          </AsyncButton>
        ),
      sortValue: () => "",
    },
  ];

  return (
    <div className="space-y-8 page-enter">
      <SectionHeader
        eyebrow="Asset In / Out"
        title="Custody and checkout logs"
        description="Track every issue and return event, surface overdue assets, and keep custody history audit-ready."
      />

      <div className="grid gap-5 md:grid-cols-3">
        <div className="panel-alt">
          <Clock3 className="size-5 text-[var(--color-brand-700)]" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{checkoutLogs.filter((entry) => !entry.checkedInAt).length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Assets currently out in the field.</p>
        </div>
        <div className="panel-alt">
          <ShieldAlert className="size-5 text-rose-600" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{checkoutLogs.filter((entry) => entry.status === "Overdue").length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Overdue returns highlighted for follow-up.</p>
        </div>
        <div className="panel-alt">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">Average Turnaround</p>
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">7.4 hrs</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Typical same-day issue to return cycle.</p>
        </div>
      </div>

      <DataTable
        title="Checkout and return trail"
        description="Filter by department, custodian, and active return risk."
        rows={rows}
        columns={columns}
        searchableFields={["assetName", "person", "department", "location"]}
        filters={
          <>
            <select value={department} onChange={(event) => setDepartment(event.target.value)} className="select-field min-w-36">
              {["All", ...new Set(checkoutLogs.map((entry) => entry.department))].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <select value={person} onChange={(event) => setPerson(event.target.value)} className="select-field min-w-40">
              {["All", ...new Set(checkoutLogs.map((entry) => entry.person))].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="select-field min-w-36">
              {["All", ...new Set(checkoutLogs.map((entry) => entry.status))].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </>
        }
      />
    </div>
  );
}
