import { useState } from "react";
import { CheckCheck, PlusCircle } from "lucide-react";
import { AsyncButton } from "../components/AsyncButton";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { formatDateTime } from "../lib/formatters";

const initialDraft = {
  title: "",
  requestType: "Asset Purchase",
  targetDepartment: "IT",
  details: "",
};

export function RequestsPage({ requests, canApprove, defaultDepartment, onSubmitRequest, onApproveRequest }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ ...initialDraft, targetDepartment: defaultDepartment ?? "IT" });
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState("");

  const columns = [
    { key: "title", label: "Request", render: (row) => <div><p className="font-semibold text-[var(--color-ink-950)]">{row.title}</p><p className="text-sm text-[var(--color-ink-500)]">{row.details}</p></div> },
    { key: "requestType", label: "Type" },
    { key: "targetDepartment", label: "Department" },
    { key: "submittedAt", label: "Submitted", render: (row) => formatDateTime(row.submittedAt), sortValue: (row) => row.submittedAt },
    { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
    {
      key: "actions",
      label: "Actions",
      render: (row) =>
        canApprove && row.status === "Pending" ? (
          <AsyncButton
            type="button"
            loading={approvingId === row.id}
            variant="secondary"
            className="!px-4 !py-2"
            onClick={async () => {
              setApprovingId(row.id);
              try {
                await onApproveRequest(row.id);
              } finally {
                setApprovingId("");
              }
            }}
          >
            Approve
          </AsyncButton>
        ) : (
          <span className="text-xs uppercase tracking-[0.22em] text-[var(--color-ink-400)]">{row.reviewedBy ?? "Awaiting review"}</span>
        ),
      sortValue: () => "",
    },
  ];

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await onSubmitRequest(draft);
      setDraft({ ...initialDraft, targetDepartment: defaultDepartment ?? "IT" });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 page-enter">
      <SectionHeader
        eyebrow="Requests"
        title="Approval requests"
        description="Department users can raise requests to super admin, and executive review can approve them directly from the workspace."
        actions={
          <button type="button" className="primary-button" onClick={() => setOpen(true)}>
            <PlusCircle className="mr-2 size-4" />
            New Request
          </button>
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        <div className="panel-alt">
          <PlusCircle className="size-5 text-[var(--color-brand-700)]" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{requests.length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Requests visible in your current scope.</p>
        </div>
        <div className="panel-alt">
          <CheckCheck className="size-5 text-emerald-600" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{requests.filter((entry) => entry.status === "Approved").length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Requests already approved and closed out.</p>
        </div>
        <div className="panel-alt">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">Pending Queue</p>
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{requests.filter((entry) => entry.status === "Pending").length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Open items waiting for executive review.</p>
        </div>
      </div>

      <DataTable title="Request register" description="Every submitted, approved, and pending operational request." rows={requests} columns={columns} searchableFields={["title", "requestType", "targetDepartment", "status", "details"]} />

      <Modal open={open} onClose={() => setOpen(false)} title="Submit approval request" description="Raise a request that the super admin can review and approve.">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--color-ink-700)]">Title</span>
            <input className="field" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--color-ink-700)]">Request Type</span>
              <select className="select-field" value={draft.requestType} onChange={(event) => setDraft({ ...draft, requestType: event.target.value })}>
                {["Asset Purchase", "Replacement", "Access Change", "Budget Approval", "Repair Escalation"].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--color-ink-700)]">Department</span>
              <select className="select-field" value={draft.targetDepartment} onChange={(event) => setDraft({ ...draft, targetDepartment: event.target.value })}>
                {["IT", "HR", "Finance", "Operations", "Security"].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--color-ink-700)]">Details</span>
            <textarea className="field min-h-28 py-3" value={draft.details} onChange={(event) => setDraft({ ...draft, details: event.target.value })} required />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="secondary-button" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <AsyncButton type="submit" loading={loading}>
              Submit Request
            </AsyncButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
