import { useCallback, useEffect, useState } from "react";

type AuthStatus = "checking" | "authenticated" | "anonymous";

export function useDashboardAuth() {
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [error, setError] = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard-session");
      const data = (await res.json()) as { authenticated?: boolean };
      setStatus(data.authenticated ? "authenticated" : "anonymous");
    } catch {
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
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (data.ok) {
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
    setStatus("anonymous");
  }, []);

  return { status, error, login, logout };
}
