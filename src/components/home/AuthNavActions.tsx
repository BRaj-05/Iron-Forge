"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "ADMIN" | "CUSTOMER";

export default function AuthNavActions() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/protected", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setRole(data?.user?.role || null);
        setChecked(true);
      })
      .catch(() => {
        setRole(null);
        setChecked(true);
      });
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setRole(null);
    router.push("/");
  }

  if (!checked || !role) {
    return (
      <div style={styles.actions}>
        <Link href="/login" style={styles.ghost}>
          Login
        </Link>
        <Link href="/signup" style={styles.primary}>
          Join Now
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.actions}>
      <Link
        href={role === "ADMIN" ? "/admin/dashboard" : "/customer/dashboard"}
        style={styles.primary}
      >
        Dashboard
      </Link>
      <button onClick={handleLogout} style={styles.logout}>
        Logout
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  actions: {
    display: "flex",
    gap: 12,
  },
  ghost: {
    border: "1px solid rgba(255,255,255,0.22)",
    color: "#fff",
    borderRadius: 10,
    padding: "11px 18px",
    textDecoration: "none",
    fontWeight: 800,
  },
  primary: {
    background: "#fff",
    color: "#111827",
    borderRadius: 10,
    padding: "12px 20px",
    textDecoration: "none",
    fontWeight: 900,
  },
  logout: {
    border: "1px solid rgba(239,68,68,0.45)",
    background: "rgba(239,68,68,0.12)",
    color: "#EF4444",
    borderRadius: 10,
    padding: "11px 18px",
    cursor: "pointer",
    fontWeight: 900,
  },
};
