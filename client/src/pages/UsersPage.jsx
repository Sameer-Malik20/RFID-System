import { useState } from "react";
import { Pencil, Plus, ShieldCheck, Users2 } from "lucide-react";
import { AsyncButton } from "../components/AsyncButton";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { roleTemplates } from "../data/userSeed";

const initialDraft = {
  fullName: "",
  email: "",
  department: "IT",
  position: "",
  roleKey: "ANALYST",
};

export function UsersPage({ users, onCreateUser, onUpdateUser }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(initialDraft);
  const [editingUserId, setEditingUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "fullName", label: "User", render: (row) => <div><p className="font-semibold text-[var(--color-ink-950)]">{row.fullName}</p><p className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-400)]">{row.email}</p></div> },
    { key: "department", label: "Department" },
    { key: "position", label: "Position" },
    { key: "roleLabel", label: "Role" },
    { key: "mustChangePassword", label: "Password Status", render: (row) => <StatusBadge value={row.mustChangePassword ? "Must Change" : "Ready"} /> },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button type="button" className="secondary-button !px-4 !py-2" onClick={() => openEdit(row)}>
          <Pencil className="mr-2 size-4" />
          Edit
        </button>
      ),
    },
  ];

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const template = roleTemplates[draft.roleKey];
      const payload = {
        ...draft,
        email: draft.email.trim().toLowerCase().replace("@susalabs.local", "@susalabs.com"),
        roleLabel: template.roleLabel,
        permissions: template.permissions,
        canManageUsers: Boolean(template.canManageUsers),
        canApproveRequests: Boolean(template.canApproveRequests),
        canSeeAllData: Boolean(template.canSeeAllData),
      };

      if (editingUserId) {
        await onUpdateUser(editingUserId, payload);
      } else {
        await onCreateUser(payload);
      }
      setDraft(initialDraft);
      setEditingUserId("");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingUserId("");
    setDraft(initialDraft);
    setOpen(true);
  }

  function openEdit(user) {
    setEditingUserId(user.id);
    setDraft({
      fullName: user.fullName,
      email: user.email,
      department: user.department,
      position: user.position,
      roleKey: user.roleKey,
    });
    setOpen(true);
  }

  return (
    <div className="space-y-8 page-enter">
      <SectionHeader
        eyebrow="Users"
        title="Department users and access setup"
        description="Manage who handles each department, what they can access after login, and who still needs to rotate the default password."
        actions={
          <button type="button" className="primary-button" onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            Create User
          </button>
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        <div className="panel-alt">
          <Users2 className="size-5 text-[var(--color-brand-700)]" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{users.length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Seeded and newly created users in the system.</p>
        </div>
        <div className="panel-alt">
          <ShieldCheck className="size-5 text-emerald-600" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{users.filter((user) => !user.mustChangePassword).length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Users who already rotated the default password.</p>
        </div>
        <div className="panel-alt">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">Default Password</p>
          <p className="mt-3 font-display text-2xl text-[var(--color-ink-950)]">ChangeMe123</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">All new users start here and can change it on first login.</p>
        </div>
      </div>

      <DataTable
        title="User directory"
        description="Department handlers, positions, roles, and password rotation state."
        rows={users}
        columns={columns}
        searchableFields={["fullName", "email", "department", "position", "roleLabel"]}
      />

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingUserId("");
          setDraft(initialDraft);
        }}
        title={editingUserId ? "Edit user" : "Create new user"}
        description={editingUserId ? "Update the department, role, and core access profile for this user." : "Assign a department, role, and default credentials for the new user."}
      >
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          {[
            ["fullName", "Full Name"],
            ["email", "Email"],
            ["position", "Position"],
          ].map(([key, label]) => (
            <label key={key} className="space-y-2">
              <span className="text-sm font-semibold text-[var(--color-ink-700)]">{label}</span>
              <input className="field" value={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} required />
            </label>
          ))}
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--color-ink-700)]">Department</span>
            <select className="select-field" value={draft.department} onChange={(event) => setDraft({ ...draft, department: event.target.value })}>
              {["IT", "HR", "Finance", "Operations", "Security"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--color-ink-700)]">Role</span>
            <select className="select-field" value={draft.roleKey} onChange={(event) => setDraft({ ...draft, roleKey: event.target.value })}>
              {Object.entries(roleTemplates).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.roleLabel}
                </option>
              ))}
            </select>
          </label>
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" className="secondary-button" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <AsyncButton type="submit" loading={loading}>
              {editingUserId ? "Save Changes" : "Create User"}
            </AsyncButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
