import { BadgeCheck, Bell, Building2, KeyRound, Mail, ShieldAlert, ShieldCheck, Siren, UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../lib/formatters";

function SummaryCard({ label, value, detail, tone = "default" }) {
  const toneClasses =
    tone === "alert"
      ? "border-rose-200 bg-rose-50/80"
      : tone === "brand"
        ? "border-[var(--color-brand-200)] bg-[var(--color-brand-50)]"
        : "border-[var(--color-line)] bg-[var(--color-shell-50)]/70";

  return (
    <div className={`rounded-[1.5rem] border p-5 ${toneClasses}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">{label}</p>
      <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">{detail}</p>
    </div>
  );
}

export function ProfilePage({ user, notifications, alerts, requests, onOpenPasswordModal }) {
  const navigate = useNavigate();
  const visibleRequests = requests.slice(0, 4);
  const attentionItems = [
    ...visibleRequests.map((request) => ({
      id: request.id,
      title: request.title,
      detail: request.details,
      meta: `${request.targetDepartment} | ${formatDateTime(request.submittedAt)}`,
      status: request.status,
      route: "/requests",
      tone: "request",
    })),
    ...alerts.slice(0, 2).map((alert) => ({
      id: alert.id,
      title: alert.title,
      detail: alert.detail,
      meta: "Operational attention required",
      status: "Alert",
      route: alert.link ?? "/requests",
      tone: "alert",
    })),
  ].slice(0, 6);
  const accessModules = user.permissions ?? [];

  return (
    <div className="page-enter space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-16 items-center justify-center rounded-[1.6rem] bg-[var(--color-shell-950)] text-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.6)]">
                <UserCircle2 className="size-8" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-brand-600)]">Profile</p>
                <h1 className="mt-2 font-display text-3xl text-[var(--color-ink-950)]">{user.fullName}</h1>
                <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
                  {user.position} supporting the {user.department} department.
                </p>
              </div>
            </div>
            <button type="button" className="secondary-button" onClick={onOpenPasswordModal}>
              <KeyRound className="mr-2 size-4" />
              Change Password
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-[var(--color-shell-50)]/70 p-4">
              <div className="flex items-center gap-2 text-[var(--color-ink-400)]">
                <Mail className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em]">Email</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-[var(--color-ink-950)]">{user.email}</p>
            </div>
            <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-[var(--color-shell-50)]/70 p-4">
              <div className="flex items-center gap-2 text-[var(--color-ink-400)]">
                <Building2 className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em]">Department Scope</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-[var(--color-ink-950)]">{user.department}</p>
            </div>
            <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-[var(--color-shell-50)]/70 p-4">
              <div className="flex items-center gap-2 text-[var(--color-ink-400)]">
                <ShieldCheck className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em]">Role Access</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-[var(--color-ink-950)]">{user.roleLabel}</p>
            </div>
            <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-[var(--color-shell-50)]/70 p-4">
              <div className="flex items-center gap-2 text-[var(--color-ink-400)]">
                <BadgeCheck className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em]">Security State</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-[var(--color-ink-950)]">{user.mustChangePassword ? "Password rotation pending" : "Password updated"}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SummaryCard label="Notifications" value={notifications.length} detail="Items currently waiting in your executive tray." tone="brand" />
          <SummaryCard label="Alerts" value={alerts.length} detail="Active issues inside your accessible operational scope." tone="alert" />
          <SummaryCard label="Requests" value={visibleRequests.length} detail="Recent requests you created or can review from this login." />
          <SummaryCard label="Module Access" value={accessModules.length} detail="Modules available after role and department filtering." />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.08fr]">
        <div className="panel">
          <div className="flex items-center gap-3">
            <div className="rounded-[1rem] bg-[var(--color-brand-50)] p-3 text-[var(--color-brand-700)]">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-600)]">Accessible Modules</p>
              <h2 className="mt-1 font-display text-2xl text-[var(--color-ink-950)]">Your current command surface</h2>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {accessModules.map((module) => (
              <span
                key={module}
                className="rounded-full border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]"
              >
                {module.replaceAll("_", " ")}
              </span>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="flex items-center gap-3">
            <div className="rounded-[1rem] bg-[var(--color-shell-50)] p-3 text-[var(--color-ink-700)]">
              <Bell className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-ink-400)]">Recent Queue</p>
              <h2 className="mt-1 font-display text-2xl text-[var(--color-ink-950)]">Requests and attention points</h2>
            </div>
          </div>

          <div className="soft-scroll mt-6 max-h-[28rem] space-y-3 overflow-y-auto pr-2">
            {attentionItems.length ? (
              attentionItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.route)}
                  className="block w-full rounded-[1.35rem] border border-[var(--color-line)] bg-[var(--color-shell-50)]/70 px-4 py-4 text-left transition hover:border-[var(--color-brand-200)] hover:bg-[var(--color-brand-50)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-[var(--color-ink-950)]">{item.title}</p>
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                        item.tone === "alert" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-[var(--color-line)] bg-white text-[var(--color-ink-400)]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">{item.detail}</p>
                  <div className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-ink-400)]">
                    {item.tone === "alert" ? <ShieldAlert className="size-3.5" /> : <Bell className="size-3.5" />}
                    {item.meta}
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-[1.35rem] border border-dashed border-[var(--color-line)] px-4 py-6 text-sm leading-6 text-[var(--color-ink-500)]">
                No request activity is mapped to your current profile yet.
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-[1.35rem] border border-[var(--color-line)] bg-[var(--color-shell-50)]/70 p-4">
              <div className="flex items-center gap-2 text-[var(--color-brand-700)]">
                <Bell className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">Notification State</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">You currently have {notifications.length} notifications across your visible workflow.</p>
            </div>
            <div className="rounded-[1.35rem] border border-[var(--color-line)] bg-[var(--color-shell-50)]/70 p-4">
              <div className="flex items-center gap-2 text-rose-600">
                <Siren className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">Alert State</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">You currently have {alerts.length} alerts that may need follow-up or escalation.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
