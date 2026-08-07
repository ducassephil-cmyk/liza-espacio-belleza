import { useCallback, useEffect, useState } from "react";

export type DashboardRole = "admin" | "worker";

export interface DashboardUser {
  id: string;
  displayName: string;
  role: DashboardRole;
}

type AuthStatus = "checking" | "authenticated" | "anonymous";

export function useDashboardAuth() {
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard-session");
      const data = (await res.json()) as { authenticated?: boolean; user?: DashboardUser | null };
      if (data.authenticated && data.user) {
        setUser(data.user);
        setStatus("authenticated");
      } else {
        setUser(null);
        setStatus("anonymous");
      }
    } catch {
      setUser(null);
      setStatus("anonymous");
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = useCallback(async (password: string) => {
    setError(null);
    try {
      const res = await fetch("/api/dashboard-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; user?: DashboardUser };
      if (data.ok && data.user) {
        setUser(data.user);
        setStatus("authenticated");
        return true;
      }
      setError(data.error ?? "Contraseña incorrecta");
      return false;
    } catch {
      setError("No pudimos conectar. Revisa tu conexión e intenta de nuevo.");
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/dashboard-logout", { method: "POST" }).catch(() => null);
    setUser(null);
    setStatus("anonymous");
  }, []);

  return { status, user, error, login, logout };
}
