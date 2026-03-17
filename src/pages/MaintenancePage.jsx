import { useState } from "react";
import { Plus, Wrench } from "lucide-react";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { formatCurrency, formatDate } from "../lib/formatters";

const initialTicket = {
  assetId: "",
  issue: "",
  technician: "",
  eta: "2026-03-20",
  cost: 0,
  priority: "Medium",
};

export function MaintenancePage({ assets, repairTickets, maintenanceSchedules, onCreateRepairTicket }) {
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketDraft, setTicketDraft] = useState({ ...initialTicket, assetId: assets[0]?.id ?? "" });

  const ticketColumns = [
    { key: "assetName", label: "Asset" },
    { key: "issue", label: "Issue" },
    { key: "technician", label: "Technician" },
    { key: "eta", label: "ETA", render: (row) => formatDate(row.eta), sortValue: (row) => row.eta },
    { key: "cost", label: "Cost", render: (row) => formatCurrency(row.cost), sortValue: (row) => row.cost },
    { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
  ];

  const scheduleColumns = [
    { key: "assetName", label: "Asset" },
    { key: "department", label: "Department" },
    { key: "cadence", label: "Cadence" },
    { key: "dueDate", label: "Due Date", render: (row) => formatDate(row.dueDate), sortValue: (row) => row.dueDate },
    { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
  ];

  function submitTicket(event) {
    event.preventDefault();
    onCreateRepairTicket({
      ...ticketDraft,
      cost: Number(ticketDraft.cost),
    });
    setTicketOpen(false);
    setTicketDraft({ ...initialTicket, assetId: assets[0]?.id ?? "" });
  }

  return (
    <div className="space-y-8 page-enter">
      <SectionHeader
        eyebrow="Repair & Maintenance"
        title="Service control"
        description="Manage repair tickets, maintenance schedules, costs, and technician assignment from one service console."
        actions={
          <button type="button" className="primary-button" onClick={() => setTicketOpen(true)}>
            <Plus className="mr-2 size-4" />
            Create Ticket
          </button>
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        <div className="panel-alt">
          <Wrench className="size-5 text-amber-600" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{repairTickets.filter((ticket) => ticket.status !== "Completed").length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Open repair tickets across the estate.</p>
        </div>
        <div className="panel-alt">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">Overdue Schedule</p>
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{maintenanceSchedules.filter((entry) => entry.status === "Overdue").length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Preventive maintenance items already breached.</p>
        </div>
        <div className="panel-alt">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">Repair Spend</p>
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">
            {formatCurrency(repairTickets.reduce((sum, ticket) => sum + ticket.cost, 0))}
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Tracked repair and maintenance cost footprint.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DataTable
          title="Repair tickets"
          description="Active diagnostics, assigned technicians, and estimated costs."
          rows={repairTickets}
          columns={ticketColumns}
          searchableFields={["assetName", "issue", "technician", "priority", "status"]}
        />
        <DataTable
          title="Maintenance schedule"
          description="Upcoming, overdue, and completed preventive maintenance tasks."
          rows={maintenanceSchedules}
          columns={scheduleColumns}
          searchableFields={["assetName", "department", "cadence", "status"]}
        />
      </div>

      <Modal
        open={ticketOpen}
        onClose={() => setTicketOpen(false)}
        title="Create repair ticket"
        description="Open a new repair or service request with ETA, technician, and cost estimate."
      >
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submitTicket}>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-[var(--color-ink-700)]">Asset</span>
            <select className="select-field" value={ticketDraft.assetId} onChange={(event) => setTicketDraft({ ...ticketDraft, assetId: event.target.value })}>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.id} • {asset.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-[var(--color-ink-700)]">Issue</span>
            <textarea className="field min-h-28 py-3" value={ticketDraft.issue} onChange={(event) => setTicketDraft({ ...ticketDraft, issue: event.target.value })} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--color-ink-700)]">Technician</span>
            <input className="field" value={ticketDraft.technician} onChange={(event) => setTicketDraft({ ...ticketDraft, technician: event.target.value })} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--color-ink-700)]">ETA</span>
            <input type="date" className="field" value={ticketDraft.eta} onChange={(event) => setTicketDraft({ ...ticketDraft, eta: event.target.value })} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--color-ink-700)]">Estimated Cost</span>
            <input type="number" className="field" value={ticketDraft.cost} onChange={(event) => setTicketDraft({ ...ticketDraft, cost: event.target.value })} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--color-ink-700)]">Priority</span>
            <select className="select-field" value={ticketDraft.priority} onChange={(event) => setTicketDraft({ ...ticketDraft, priority: event.target.value })}>
              {["Low", "Medium", "High", "Critical"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <div className="md:col-span-2 flex justify-end gap-3">
            <button type="button" className="secondary-button" onClick={() => setTicketOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Open Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
