import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

const STORAGE_KEY = "rfid-system-session";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) ?? "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const payload = await apiFetch("/auth/me", { token });
        if (!cancelled) {
          setUser(payload.user);
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem(STORAGE_KEY);
          setToken("");
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSession();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function login(email, password) {
    const payload = await apiFetch("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    localStorage.setItem(STORAGE_KEY, payload.token);
    setToken(payload.token);
    setUser(payload.user);
    return payload.user;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setToken("");
    setUser(null);
  }

  async function changePassword(currentPassword, nextPassword) {
    const payload = await apiFetch("/auth/change-password", {
      method: "POST",
      token,
      body: { currentPassword, nextPassword },
    });
    localStorage.setItem(STORAGE_KEY, payload.token);
    setToken(payload.token);
    setUser(payload.user);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      changePassword,
      setUser,
    }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
