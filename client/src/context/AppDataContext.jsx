import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "../lib/api";
import { useAuth } from "./AuthContext";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { token, user, isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    if (!isAuthenticated || !user) {
      setData(null);
      return;
    }

    setLoading(true);
    try {
      const payload = await apiFetch("/bootstrap", { token });
      setData(payload);
    } catch (error) {
      toast.error(error.message ?? "Failed to load workspace data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [token, user]);

  async function runAction(path, options, successMessage) {
    await apiFetch(path, {
      token,
      ...options,
    });
    await refresh();
    if (successMessage) {
      toast.success(successMessage);
    }
  }

  const value = useMemo(
    () => ({
      data,
      loading,
      refresh,
      saveAsset: async (asset) => {
        const exists = data?.assets.some((entry) => entry.id === asset.id);
        await runAction(exists ? `/assets/${asset.id}` : "/assets", { method: exists ? "PUT" : "POST", body: asset }, "Asset saved.");
      },
      importAssets: async (assets) => runAction("/assets/import", { method: "POST", body: { assets } }, `${assets.length} assets imported.`),
      checkInAsset: async (logId) => runAction(`/checkouts/${logId}/check-in`, { method: "POST" }, "Asset checked in."),
      transferAsset: async (transferDraft) => runAction("/transfers", { method: "POST", body: transferDraft }, "Asset transfer approved."),
      createRepairTicket: async (ticketDraft) => runAction("/repair-tickets", { method: "POST", body: ticketDraft }, "Repair ticket created."),
      runSecurityScan: async (scanDraft) => runAction("/security-scans", { method: "POST", body: scanDraft }, "Security verification completed."),
      createUser: async (userDraft) => runAction("/users", { method: "POST", body: userDraft }, "User created with default password ChangeMe123."),
      updateUser: async (userId, userDraft) => runAction(`/users/${userId}`, { method: "PUT", body: userDraft }, "User updated."),
      submitRequest: async (requestDraft) => runAction("/requests", { method: "POST", body: requestDraft }, "Approval request submitted."),
      approveRequest: async (requestId) => runAction(`/requests/${requestId}/approve`, { method: "POST" }, "Request approved."),
      markNotificationRead: async (notificationId) => runAction(`/notifications/${notificationId}/read`, { method: "POST" }),
    }),
    [data, loading, token],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider.");
  }
  return context;
}
