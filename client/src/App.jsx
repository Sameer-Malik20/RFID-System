import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AppShell } from "./components/AppShell";
import { AsyncButton } from "./components/AsyncButton";
import { Modal } from "./components/Modal";
import { PageLoader } from "./components/PageLoader";
import { PasswordField } from "./components/PasswordField";
import { useAuth } from "./context/AuthContext";
import { useAppData } from "./context/AppDataContext";
import { LoginPage } from "./pages/LoginPage";

const DashboardPage = lazy(() => import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const AssetsPage = lazy(() => import("./pages/AssetsPage").then((module) => ({ default: module.AssetsPage })));
const AssetDetailPage = lazy(() => import("./pages/AssetDetailPage").then((module) => ({ default: module.AssetDetailPage })));
const DepartmentsPage = lazy(() => import("./pages/DepartmentsPage").then((module) => ({ default: module.DepartmentsPage })));
const AssetLogsPage = lazy(() => import("./pages/AssetLogsPage").then((module) => ({ default: module.AssetLogsPage })));
const MovementLogsPage = lazy(() => import("./pages/MovementLogsPage").then((module) => ({ default: module.MovementLogsPage })));
const MaintenancePage = lazy(() => import("./pages/MaintenancePage").then((module) => ({ default: module.MaintenancePage })));
const LifecyclePage = lazy(() => import("./pages/LifecyclePage").then((module) => ({ default: module.LifecyclePage })));
const PassiveDevicesPage = lazy(() => import("./pages/PassiveDevicesPage").then((module) => ({ default: module.PassiveDevicesPage })));
const ProfilePage = lazy(() => import("./pages/ProfilePage").then((module) => ({ default: module.ProfilePage })));
const SecurityPage = lazy(() => import("./pages/SecurityPage").then((module) => ({ default: module.SecurityPage })));
const UsersPage = lazy(() => import("./pages/UsersPage").then((module) => ({ default: module.UsersPage })));
const RequestsPage = lazy(() => import("./pages/RequestsPage").then((module) => ({ default: module.RequestsPage })));

function UnauthorizedPage() {
  return (
    <div className="panel page-enter">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-brand-600)]">Restricted</p>
      <h2 className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">This module is outside your current access scope.</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-ink-500)]">
        Your login is filtered by department and responsibility. Super admin can expand access if your role changes.
      </p>
    </div>
  );
}

export default function App() {
  const auth = useAuth();
  const appData = useAppData();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordDraft, setPasswordDraft] = useState({ currentPassword: "ChangeMe123", nextPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (auth.user?.mustChangePassword) {
      setPasswordModalOpen(true);
    }
  }, [auth.user?.mustChangePassword]);

  const employees = useMemo(
    () => (appData.data?.users ?? []).map((user) => ({ id: user.id, name: user.fullName, department: user.department, role: user.position })),
    [appData.data?.users],
  );

  function allow(permission) {
    return auth.user?.permissions?.includes(permission);
  }

  async function handleLogin(email, password) {
    try {
      await auth.login(email, password);
      toast.success("Signed in successfully.");
    } catch (error) {
      toast.error(error.message ?? "Unable to sign in.");
    }
  }

  async function handlePasswordChange(event) {
    event.preventDefault();
    setPasswordLoading(true);
    try {
      await auth.changePassword(passwordDraft.currentPassword, passwordDraft.nextPassword);
      toast.success("Password updated.");
      setPasswordModalOpen(false);
      setPasswordDraft({ currentPassword: "", nextPassword: "" });
    } catch (error) {
      toast.error(error.message ?? "Unable to update password.");
    } finally {
      setPasswordLoading(false);
    }
  }

  if (auth.loading) {
    return <PageLoader title="Restoring your secure session..." detail="Checking the last authenticated workspace and role mapping." />;
  }

  if (!auth.isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  if (appData.loading || !appData.data) {
    return (
      <>
        <Toaster position="top-right" />
        <PageLoader />
      </>
    );
  }

  const data = appData.data;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "18px",
            border: "1px solid rgba(206, 219, 235, 0.85)",
            padding: "14px 16px",
            background: "rgba(255,255,255,0.94)",
            color: "#10243f",
          },
        }}
      />
      <AppShell
        user={auth.user}
        notifications={data.notifications}
        alerts={data.alerts}
        searchIndex={data.searchIndex}
        onLogout={auth.logout}
      >
        <Suspense fallback={<PageLoader title="Loading module..." detail="Preparing charts, records, permissions, and workflow controls." />}>
          <Routes>
            <Route
              path="/profile"
              element={
                <ProfilePage
                  user={auth.user}
                  notifications={data.notifications}
                  alerts={data.alerts}
                  requests={data.requests}
                  onOpenPasswordModal={() => setPasswordModalOpen(true)}
                />
              }
            />
            <Route
              path="/"
              element={
                allow("dashboard") ? (
                  <DashboardPage
                    assets={data.assets}
                    departments={data.departments}
                    activities={data.activities}
                    checkoutLogs={data.checkoutLogs}
                    maintenanceSchedules={data.maintenanceSchedules}
                    securityLogs={data.securityLogs}
                    utilizationTrend={data.utilizationTrend}
                  />
                ) : (
                  <UnauthorizedPage />
                )
              }
            />
            <Route
              path="/assets"
              element={allow("assets") ? <AssetsPage assets={data.assets} employees={employees} onSaveAsset={appData.saveAsset} onImportAssets={appData.importAssets} /> : <UnauthorizedPage />}
            />
            <Route
              path="/assets/:assetId"
              element={
                allow("assets") ? (
                  <AssetDetailPage assets={data.assets} movementLogs={data.movementLogs} repairTickets={data.repairTickets} passiveDevices={data.passiveDevices} />
                ) : (
                  <UnauthorizedPage />
                )
              }
            />
            <Route
              path="/departments"
              element={allow("departments") ? <DepartmentsPage departments={data.departments} assets={data.assets} onTransferAsset={appData.transferAsset} /> : <UnauthorizedPage />}
            />
            <Route path="/asset-logs" element={allow("asset_logs") ? <AssetLogsPage checkoutLogs={data.checkoutLogs} onCheckInAsset={appData.checkInAsset} /> : <UnauthorizedPage />} />
            <Route
              path="/movement-logs"
              element={allow("movement_logs") ? <MovementLogsPage movementLogs={data.movementLogs} assets={data.assets} /> : <UnauthorizedPage />}
            />
            <Route
              path="/maintenance"
              element={
                allow("maintenance") ? (
                  <MaintenancePage
                    assets={data.assets}
                    repairTickets={data.repairTickets}
                    maintenanceSchedules={data.maintenanceSchedules}
                    onCreateRepairTicket={appData.createRepairTicket}
                  />
                ) : (
                  <UnauthorizedPage />
                )
              }
            />
            <Route path="/lifecycle" element={allow("lifecycle") ? <LifecyclePage assets={data.assets} /> : <UnauthorizedPage />} />
            <Route
              path="/passive-devices"
              element={allow("passive_devices") ? <PassiveDevicesPage assets={data.assets} passiveDevices={data.passiveDevices} /> : <UnauthorizedPage />}
            />
            <Route
              path="/security"
              element={
                allow("security") ? (
                  <SecurityPage assets={data.assets} employees={employees} securityLogs={data.securityLogs} onRunSecurityScan={appData.runSecurityScan} />
                ) : (
                  <UnauthorizedPage />
                )
              }
            />
            <Route
              path="/users"
              element={auth.user.canManageUsers ? <UsersPage users={data.users} onCreateUser={appData.createUser} onUpdateUser={appData.updateUser} /> : <UnauthorizedPage />}
            />
            <Route
              path="/requests"
              element={
                allow("requests") ? (
                  <RequestsPage
                    requests={data.requests}
                    canApprove={auth.user.canApproveRequests}
                    defaultDepartment={auth.user.department}
                    onSubmitRequest={appData.submitRequest}
                    onApproveRequest={appData.approveRequest}
                  />
                ) : (
                  <UnauthorizedPage />
                )
              }
            />
          </Routes>
        </Suspense>
      </AppShell>

      <Modal
        open={passwordModalOpen}
        onClose={() => {
          if (!auth.user?.mustChangePassword) {
            setPasswordModalOpen(false);
          }
        }}
        title="Change your password"
        description="Every user can rotate the default password. This keeps login secure and department access auditable."
      >
        <form className="grid gap-4" onSubmit={handlePasswordChange}>
          <PasswordField
            label="Current password"
            value={passwordDraft.currentPassword}
            onChange={(event) => setPasswordDraft({ ...passwordDraft, currentPassword: event.target.value })}
            autoComplete="current-password"
            required
          />
          <PasswordField
            label="New password"
            value={passwordDraft.nextPassword}
            onChange={(event) => setPasswordDraft({ ...passwordDraft, nextPassword: event.target.value })}
            autoComplete="new-password"
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            {!auth.user?.mustChangePassword ? (
              <button type="button" className="secondary-button" onClick={() => setPasswordModalOpen(false)}>
                Later
              </button>
            ) : null}
            <AsyncButton type="submit" loading={passwordLoading}>
              Update Password
            </AsyncButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
