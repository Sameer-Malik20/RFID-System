import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Boxes,
  ChevronRight,
  ClipboardCheck,
  Command,
  Cpu,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCircle2,
  Users2,
  Wrench,
  X,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn, formatDateTime } from "../lib/formatters";
import susalabsMark from "../assets/susalabs-mark.png";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard", end: true },
  { to: "/profile", label: "Profile", icon: UserCircle2, alwaysVisible: true },
  { to: "/assets", label: "Assets", icon: Boxes, permission: "assets" },
  { to: "/departments", label: "Departments", icon: Command, permission: "departments" },
  { to: "/asset-logs", label: "Asset In / Out", icon: ClipboardCheck, permission: "asset_logs" },
  { to: "/movement-logs", label: "Movement Logs", icon: ChevronRight, permission: "movement_logs" },
  { to: "/maintenance", label: "Repair & Maintenance", icon: Wrench, permission: "maintenance" },
  { to: "/lifecycle", label: "Aging & Lifecycle", icon: Bell, permission: "lifecycle" },
  { to: "/passive-devices", label: "Passive Devices", icon: Cpu, permission: "passive_devices" },
  { to: "/security", label: "Security", icon: ShieldCheck, permission: "security" },
  { to: "/requests", label: "Requests", icon: ShieldAlert, permission: "requests" },
  { to: "/users", label: "Users", icon: Users2, permission: "users", superAdminOnly: true },
];

const routeCopy = {
  "/": "Enterprise command center for RFID-tracked asset operations.",
  "/profile": "Identity, department scope, access controls, and personal security preferences.",
  "/assets": "Full master register with filters, edit flows, and ownership context.",
  "/departments": "Department utilization and controlled asset transfer.",
  "/asset-logs": "Checkout, return, and overdue operational accountability.",
  "/movement-logs": "Location history, approvals, and audit timelines.",
  "/maintenance": "Repair tickets, schedules, and cost monitoring.",
  "/lifecycle": "Aging, depreciation, warranty exposure, and renewal planning.",
  "/passive-devices": "RFID, beacon, hooter, QR, and barcode control plane.",
  "/security": "Verification scans, movement exceptions, and compliance logs.",
  "/users": "Department handlers, access setup, and password rotation oversight.",
  "/requests": "Submit approvals to super admin and review pending decisions.",
};

function DropdownPanel({ title, countLabel, items, emptyCopy, tone = "brand", onSelect }) {
  const toneStyles =
    tone === "alert"
      ? {
          badge: "bg-rose-100 text-rose-700 border-rose-200",
          card: "hover:border-rose-200 hover:bg-rose-50/80",
        }
      : {
          badge: "bg-[var(--color-brand-50)] text-[var(--color-brand-700)] border-[var(--color-brand-200)]",
          card: "hover:border-[var(--color-brand-200)] hover:bg-[var(--color-brand-50)]",
        };

  return (
    <div className="absolute right-0 top-[calc(100%+0.85rem)] z-[140] w-[min(92vw,24rem)] rounded-[1.7rem] border border-[var(--color-line)] bg-white p-4 shadow-[0_30px_80px_-32px_rgba(15,23,42,0.45)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-ink-400)]">{title}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">{countLabel}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${toneStyles.badge}`}>{items.length}</span>
      </div>
      <div className="soft-scroll mt-4 max-h-[22rem] space-y-3 overflow-y-auto pr-1">
        {items.length ? (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={`w-full rounded-[1.25rem] border border-[var(--color-line)] bg-[var(--color-shell-50)]/70 px-4 py-3 text-left transition ${toneStyles.card}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--color-ink-950)]">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-ink-500)]">{item.detail ?? item.subtitle}</p>
                </div>
                {item.createdAt || item.timestamp ? (
                  <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-400)]">
                    {formatDateTime(item.createdAt ?? item.timestamp)}
                  </span>
                ) : null}
              </div>
            </button>
          ))
        ) : (
          <div className="rounded-[1.25rem] border border-dashed border-[var(--color-line)] px-4 py-6 text-sm text-[var(--color-ink-500)]">{emptyCopy}</div>
        )}
      </div>
    </div>
  );
}

export function AppShell({ user, notifications, alerts, searchIndex, onLogout, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const notificationsRef = useRef(null);
  const alertsRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const pageDescription = routeCopy[location.pathname] ?? "Asset intelligence with premium operational visibility.";

  const filteredNav = navItems.filter((item) => {
    if (item.alwaysVisible) {
      return true;
    }
    if (item.superAdminOnly) {
      return user.canManageUsers;
    }
    return user.permissions.includes(item.permission);
  });

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return [];
    }
    return searchIndex.filter((entry) => `${entry.title} ${entry.subtitle} ${entry.kind}`.toLowerCase().includes(query)).slice(0, 8);
  }, [searchIndex, searchQuery]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(event.target)) {
        setShowAlerts(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setShowNotifications(false);
        setShowAlerts(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleNavigate(route) {
    setShowNotifications(false);
    setShowAlerts(false);
    setSearchQuery("");
    setMobileOpen(false);
    navigate(route);
  }

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
            <div className="font-display text-xl">RFID System</div>
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
                  <p className="font-display text-xl">RFID System</p>
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
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">Logged in as</p>
              <p className="mt-3 font-display text-2xl">{user.fullName}</p>
              <p className="mt-2 text-sm leading-6 text-white/65">{user.position} · {user.department}</p>
            </div>
          ) : null}

          <nav className="mt-8 space-y-2">
            {filteredNav.map((item) => (
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
                <li>{alerts.length} alerts are visible in your current scope.</li>
                <li>{notifications.length} notifications are waiting in the executive tray.</li>
                <li>{user.canManageUsers ? "User creation and approvals are enabled." : "Requests can be raised to super admin from your scope."}</li>
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
          <div className="panel relative z-30 mb-6 flex flex-col gap-5 overflow-visible bg-white/80">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-brand-600)]">Executive Layer</p>
                <h2 className="mt-2 font-display text-3xl text-[var(--color-ink-950)]">Operations-grade asset intelligence</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-ink-500)]">{pageDescription}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-[1.25rem] border border-[var(--color-line)] bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-400)]">Signed in</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-ink-950)]">{user.fullName}</p>
                </div>
                <div className="rounded-[1.25rem] border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">Risk posture</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-brand-800)]">{alerts.length} active alerts</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-ink-400)]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search assets, users, requests, departments..."
                  className="field pl-11"
                />
                {searchResults.length ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-[120] rounded-[1.6rem] border border-[var(--color-line)] bg-white p-3 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.35)]">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => handleNavigate(result.route)}
                        className="flex w-full items-start justify-between rounded-[1.25rem] px-3 py-3 text-left transition hover:bg-[var(--color-brand-50)]"
                      >
                        <div>
                          <p className="font-semibold text-[var(--color-ink-950)]">{result.title}</p>
                          <p className="mt-1 text-sm text-[var(--color-ink-500)]">{result.subtitle}</p>
                        </div>
                        <span className="rounded-full bg-[var(--color-shell-50)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-400)]">
                          {result.kind}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div ref={notificationsRef} className="relative">
                  <button type="button" className="icon-button relative" onClick={() => { setShowNotifications((current) => !current); setShowAlerts(false); }}>
                    <Bell className="size-4" />
                    {notifications.length ? <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--color-brand-600)] px-1.5 py-0.5 text-[10px] font-bold text-white">{notifications.length}</span> : null}
                  </button>
                  {showNotifications ? (
                    <DropdownPanel
                      title="Notifications"
                      countLabel={notifications.length ? "Recent workflow updates in your current scope." : "Nothing new in your current scope."}
                      items={notifications}
                      emptyCopy="No notifications in your current scope."
                      onSelect={(item) => handleNavigate(item.link)}
                    />
                  ) : null}
                </div>

                <div ref={alertsRef} className="relative">
                  <button type="button" className="icon-button relative" onClick={() => { setShowAlerts((current) => !current); setShowNotifications(false); }}>
                    <ShieldAlert className="size-4" />
                    {alerts.length ? <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{alerts.length}</span> : null}
                  </button>
                  {showAlerts ? (
                    <DropdownPanel
                      title="Alerts"
                      countLabel={alerts.length ? "Operational issues that need attention now." : "No active alerts in your current scope."}
                      items={alerts}
                      emptyCopy="No active alerts in your current scope."
                      tone="alert"
                      onSelect={(item) => handleNavigate(item.link)}
                    />
                  ) : null}
                </div>

                <button type="button" className="secondary-button !px-4 !py-3" onClick={onLogout}>
                  <LogOut className="mr-2 size-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
