"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { AppRole } from "@/lib/routing";
import { apiRoutes } from "@/config/api-routes";

export type AuthUser = { id: string; name: string; email: string; role: AppRole; photoUrl?: string | null };
type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signIn: (user: AuthUser) => void;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const refresh = useCallback(async () => {
    try {
      const response = await fetch(apiRoutes.auth.me, { cache: "no-store" });
      setUser(response.ok ? (await response.json()).user : null);
    } catch { setUser(null); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  async function logout() {
    try {
      const response = await fetch(apiRoutes.auth.logout, { method: "POST" });
      if (!response.ok) throw new Error();
      setUser(null);
      router.replace("/");
      router.refresh();
    } catch { toast.error("Could not sign out. Please try again."); }
  }
  return <AuthContext.Provider value={{ user, loading, refresh, signIn: (next) => { setUser(next); setLoading(false); }, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
