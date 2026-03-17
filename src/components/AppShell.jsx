import { useState } from "react";
import { Bell, Boxes, ChevronRight, ClipboardCheck, Command, Cpu, LayoutDashboard, Menu, PanelLeftClose, PanelLeftOpen, ShieldCheck, Wrench, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "../lib/formatters";
import susalabsMark from "../assets/susalabs-mark.png";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/assets", label: "Assets", icon: Boxes },
  { to: "/departments", label: "Departments", icon: Command },
  { to: "/asset-logs", label: "Asset In / Out", icon: ClipboardCheck },
  { to: "/movement-logs", label: "Movement Logs", icon: ChevronRight },
  { to: "/maintenance", label: "Repair & Maintenance", icon: Wrench },
  { to: "/lifecycle", label: "Aging & Lifecycle", icon: Bell },
  { to: "/passive-devices", label: "Passive Devices", icon: Cpu },
  { to: "/security", label: "Security", icon: ShieldCheck },
];

const routeCopy = {
  "/": "Enterprise command center for RFID-tracked asset operations.",
  "/assets": "Full master register with filters, edit flows, and ownership context.",
  "/departments": "Department utilization and controlled asset transfer.",
  "/asset-logs": "Checkout, return, and overdue operational accountability.",
  "/movement-logs": "Location history, approvals, and audit timelines.",
  "/maintenance": "Repair tickets, schedules, and cost monitoring.",
  "/lifecycle": "Aging, depreciation, warranty exposure, and renewal planning.",
  "/passive-devices": "RFID, beacon, hooter, QR, and barcode control plane.",
  "/security": "Verification scans, movement exceptions, and compliance logs.",
};

export function AppShell({ children }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pageDescription = routeCopy[location.pathname] ?? "Asset intelligence with premium operational visibility.";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(12,111,168,0.10),transparent_28%),radial-gradient(circle_at_top_right,rgba(7,24,49,0.12),transparent_24%),var(--color-shell-25)]">
      <div className="relative mx-auto min-h-screen max-w-[1800px]">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="fixed left-4 top-4 z-40 inline-flex size-11 items-center justify-center rounded-2xl border border-white/20 bg-[var(--color-shell-950)] text-white shadow-xl lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 overflow-y-auto border-r border-white/10 bg-[linear-gradient(180deg,#071831_0%,#0a2448_48%,#0d315f_100%)] py-8 text-white transition-[width,transform,padding] duration-300 lg:translate-x-0",
            isSidebarCollapsed ? "w-[104px] px-4" : "w-[296px] px-6",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between lg:hidden">
            <div className="font-display text-xl">RFID CRM</div>
            <button type="button" onClick={() => setMobileOpen(false)} className="icon-button !border-white/10 !bg-white/5 !text-white">
              <X className="size-4" />
            </button>
          </div>

          <div className={cn("mt-6 flex items-center lg:mt-0", isSidebarCollapsed ? "justify-center" : "gap-4")}>
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className={cn("group flex items-center", isSidebarCollapsed ? "justify-center" : "min-w-0 flex-1 gap-4")}
              aria-label="Go to dashboard"
              title="Go to dashboard"
            >
              <div className="flex size-15 items-center justify-center overflow-hidden rounded-[1.7rem] bg-white p-1.5 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.65)] ring-1 ring-white/20 transition group-hover:-translate-y-0.5 group-hover:shadow-[0_24px_50px_-30px_rgba(15,23,42,0.72)]">
                <img src={susalabsMark} alt="SJ mark" className="h-full w-full object-contain" />
              </div>
              {!isSidebarCollapsed ? (
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl">RFID CRM</p>
                  <p className="text-sm text-white/60">Enterprise Asset Management</p>
                </div>
              ) : null}
            </Link>
            {!isSidebarCollapsed ? (
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed((current) => !current)}
                className="hidden lg:inline-flex size-10 items-center justify-center rounded-[1rem] border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="hidden lg:inline-flex absolute right-3 top-6 size-10 items-center justify-center rounded-[1rem] border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Expand sidebar"
                title="Expand sidebar"
              >
                <PanelLeftOpen className="size-4" />
              </button>
            )}
          </div>

          {!isSidebarCollapsed ? (
            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">Operational Pulse</p>
              <p className="mt-3 font-display text-4xl">94.2%</p>
              <p className="mt-2 text-sm leading-6 text-white/65">Verification coverage across tracked assets this week.</p>
            </div>
          ) : null}

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center rounded-[1.5rem] py-3.5 transition",
                    isSidebarCollapsed ? "justify-center px-3" : "justify-between px-4",
                    isActive
                      ? "bg-white text-[var(--color-shell-950)] shadow-[0_25px_50px_-28px_rgba(15,23,42,0.5)]"
                      : "text-white/70 hover:bg-white/8 hover:text-white",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={cn("flex items-center", isSidebarCollapsed ? "justify-center" : "gap-3")}>
                      <item.icon className={cn("size-4.5", isActive ? "text-[var(--color-brand-700)]" : "text-white/55")} />
                      {!isSidebarCollapsed ? <span className="text-sm font-medium">{item.label}</span> : null}
                    </div>
                    {!isSidebarCollapsed ? (
                      <ChevronRight className={cn("size-4 transition", isActive ? "translate-x-0 text-[var(--color-brand-700)]" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100")} />
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {!isSidebarCollapsed ? (
            <div className="mt-8 rounded-[1.75rem] border border-[rgba(255,255,255,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">What stands out</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-white/70">
                <li>2 assets crossed maintenance SLA today.</li>
                <li>1 unauthorized movement needs approval review.</li>
                <li>Passive device estate is 86% battery healthy.</li>
              </ul>
            </div>
          ) : null}
        </aside>

        {mobileOpen ? <button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-[rgba(7,24,49,0.25)] backdrop-blur-sm lg:hidden" /> : null}

        <main
          className={cn(
            "relative z-10 px-4 pb-10 pt-20 sm:px-6 lg:pr-8 lg:pt-8",
            isSidebarCollapsed ? "lg:pl-[136px]" : "lg:pl-[328px]",
          )}
        >
          <div className="panel mb-6 flex flex-col gap-5 bg-white/80 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-brand-600)]">Executive Layer</p>
              <h2 className="mt-2 font-display text-3xl text-[var(--color-ink-950)]">Operations-grade asset intelligence</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-ink-500)]">{pageDescription}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-[1.25rem] border border-[var(--color-line)] bg-white px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-400)]">Last sync</p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-ink-950)]">17 Mar 2026, 09:10 IST</p>
              </div>
              <div className="rounded-[1.25rem] border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">Risk posture</p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-brand-800)]">Contained, 3 active alerts</p>
              </div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
