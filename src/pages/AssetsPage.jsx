import { useState } from "react";
import { Download, FileUp, Pencil, Plus, SearchCode } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { formatCurrency, formatDate } from "../lib/formatters";

const initialForm = {
  id: "",
  name: "",
  type: "Laptop",
  department: "IT",
  assignedTo: "Rahul Sharma",
  purchaseDate: "2026-03-17",
  warrantyExpiry: "2029-03-17",
  status: "Active",
  location: "",
  value: 0,
  verificationStatus: "Verified",
  lifecycleStatus: "Good",
  serial: "",
  vendor: "",
  notes: "",
};

export function AssetsPage({ assets, employees, onSaveAsset }) {
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [assetDraft, setAssetDraft] = useState(initialForm);
  const [editingAssetId, setEditingAssetId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredAssets = assets.filter((asset) => {
    return (
      (departmentFilter === "All" || asset.department === departmentFilter) &&
      (typeFilter === "All" || asset.type === typeFilter) &&
      (statusFilter === "All" || asset.status === statusFilter) &&
      (locationFilter === "All" || asset.location.includes(locationFilter))
    );
  });

  const columns = [
    {
      key: "name",
      label: "Asset",
      render: (asset) => (
        <div className="space-y-1">
          <Link to={`/assets/${asset.id}`} className="font-semibold text-[var(--color-ink-950)] transition hover:text-[var(--color-brand-700)]">
            {asset.name}
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-400)]">
            {asset.id} • {asset.type}
          </p>
        </div>
      ),
      sortValue: (asset) => asset.name,
    },
    {
      key: "department",
      label: "Department",
    },
    {
      key: "status",
      label: "Status",
      render: (asset) => <StatusBadge value={asset.status} />,
    },
    {
      key: "assignedTo",
      label: "Assigned To",
    },
    {
      key: "value",
      label: "Value",
      render: (asset) => <span className="font-semibold text-[var(--color-ink-950)]">{formatCurrency(asset.value)}</span>,
      sortValue: (asset) => asset.value,
    },
    {
      key: "actions",
      label: "Actions",
      render: (asset) => (
        <button type="button" className="secondary-button !px-4 !py-2" onClick={() => openEditModal(asset)}>
          <Pencil className="mr-2 size-4" />
          Edit
        </button>
      ),
      sortValue: () => "",
    },
  ];

  function openCreateModal() {
    setEditingAssetId("");
    setAssetDraft(initialForm);
    setModalOpen(true);
  }

  function openEditModal(asset) {
    setEditingAssetId(asset.id);
    setAssetDraft({ ...asset });
    setModalOpen(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSaveAsset({
      ...assetDraft,
      value: Number(assetDraft.value),
    });
    setModalOpen(false);
    setEditingAssetId("");
    setAssetDraft(initialForm);
  }

  function handleImport() {
    toast.success("Bulk import simulation completed. 4 staged records validated.");
  }

  function handleExport() {
    toast.success("Export ready. Asset register prepared for CSV download.");
  }

  return (
    <div className="space-y-8 page-enter">
      <SectionHeader
        eyebrow="Assets"
        title="Master asset register"
        description="Filter, inspect, and update the complete asset inventory with ownership, status, and location intelligence."
        actions={
          <>
            <button type="button" className="secondary-button" onClick={handleImport}>
              <FileUp className="mr-2 size-4" />
              Bulk Import
            </button>
            <button type="button" className="secondary-button" onClick={handleExport}>
              <Download className="mr-2 size-4" />
              Export
            </button>
            <button type="button" className="primary-button" onClick={openCreateModal}>
              <Plus className="mr-2 size-4" />
              Add Asset
            </button>
          </>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="panel-alt">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">Asset Count</p>
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{assets.length}</p>
        </div>
        <div className="panel-alt">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">Verified</p>
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">
            {assets.filter((asset) => asset.verificationStatus === "Verified").length}
          </p>
        </div>
        <div className="panel-alt">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">High Value Pool</p>
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">
            {formatCurrency(assets.reduce((sum, asset) => sum + asset.value, 0))}
          </p>
        </div>
        <div className="panel-alt">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">Searchability</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-brand-50)] px-3 py-2 text-sm font-semibold text-[var(--color-brand-700)]">
            <SearchCode className="size-4" />
            Filters, sort, pagination
          </div>
        </div>
      </div>

      <DataTable
        title="Asset inventory"
        description="Sort, filter, and drill into each asset's operational record."
        rows={filteredAssets}
        columns={columns}
        searchableFields={["id", "name", "type", "department", "assignedTo", "location", "vendor"]}
        filters={
          <>
            <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="select-field min-w-36">
              {["All", ...new Set(assets.map((asset) => asset.department))].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="select-field min-w-36">
              {["All", ...new Set(assets.map((asset) => asset.type))].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="select-field min-w-40">
              {["All", ...new Set(assets.map((asset) => asset.status))].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)} className="select-field min-w-40">
              {["All", "HQ", "Tower", "Plant", "Warehouse", "Data Center", "Security"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </>
        }
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAssetId ? "Edit asset" : "Add new asset"}
        description="Capture asset profile, ownership, warranty, and lifecycle metadata."
      >
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          {[
            ["id", "Asset ID"],
            ["name", "Asset Name"],
            ["type", "Asset Type"],
            ["department", "Department"],
            ["assignedTo", "Assigned To"],
            ["location", "Location"],
            ["purchaseDate", "Purchase Date", "date"],
            ["warrantyExpiry", "Warranty Expiry", "date"],
            ["status", "Status"],
            ["verificationStatus", "Verification Status"],
            ["lifecycleStatus", "Lifecycle Status"],
            ["serial", "Serial Number"],
            ["vendor", "Vendor"],
            ["value", "Asset Value", "number"],
          ].map(([key, label, type]) => (
            <label key={key} className="space-y-2">
              <span className="text-sm font-semibold text-[var(--color-ink-700)]">{label}</span>
              {key === "assignedTo" ? (
                <select className="select-field" value={assetDraft[key]} onChange={(event) => setAssetDraft({ ...assetDraft, [key]: event.target.value })}>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.name}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              ) : key === "department" ? (
                <select className="select-field" value={assetDraft[key]} onChange={(event) => setAssetDraft({ ...assetDraft, [key]: event.target.value })}>
                  {["IT", "HR", "Finance", "Operations", "Security"].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : ["status", "verificationStatus", "lifecycleStatus", "type"].includes(key) ? (
                <select className="select-field" value={assetDraft[key]} onChange={(event) => setAssetDraft({ ...assetDraft, [key]: event.target.value })}>
                  {(key === "status"
                    ? ["Active", "Checked Out", "Under Repair", "Maintenance Due", "Aging", "Retired"]
                    : key === "verificationStatus"
                      ? ["Verified", "Unverified", "Flagged"]
                      : key === "lifecycleStatus"
                        ? ["Good", "Fair", "Poor", "End of Life"]
                        : ["Laptop", "Tablet", "Printer", "Projector", "Power Backup", "Security Camera", "Server", "Network", "Furniture", "Facility", "Safety", "Scanner", "RFID Reader"]
                  ).map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type ?? "text"}
                  className="field"
                  value={assetDraft[key]}
                  onChange={(event) => setAssetDraft({ ...assetDraft, [key]: event.target.value })}
                  required
                />
              )}
            </label>
          ))}

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-[var(--color-ink-700)]">Notes</span>
            <textarea
              className="field min-h-28 py-3"
              value={assetDraft.notes}
              onChange={(event) => setAssetDraft({ ...assetDraft, notes: event.target.value })}
            />
          </label>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              {editingAssetId ? "Save Changes" : "Create Asset"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
