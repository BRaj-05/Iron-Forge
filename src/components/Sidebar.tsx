"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { theme } from "@/lib/theme";

type Role = "ADMIN" | "CUSTOMER";

interface SidebarProps {
  role: Role;
}

const navItems: Array<{
  label: string;
  icon: string;
  path: string;
  roles: Role[];
}> = [
  { label: "Dashboard", icon: "DB", path: "/admin/dashboard", roles: ["ADMIN"] },
  { label: "Members", icon: "MB", path: "/admin/members", roles: ["ADMIN"] },
  { label: "Analytics", icon: "AN", path: "/admin/analytics", roles: ["ADMIN"] },
  { label: "Media", icon: "IM", path: "/admin/media", roles: ["ADMIN"] },
  {
    label: "Dashboard",
    icon: "DB",
    path: "/customer/dashboard",
    roles: ["CUSTOMER"],
  },
  {
    label: "Workouts",
    icon: "WO",
    path: "/customer/todos",
    roles: ["CUSTOMER"],
  },
  {
    label: "Calendar",
    icon: "CA",
    path: "/customer/calendar",
    roles: ["CUSTOMER"],
  },
  {
    label: "Leaderboard",
    icon: "LB",
    path: "/customer/leaderboard",
    roles: ["CUSTOMER"],
  },
];

export default function Sidebar({ role }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside
      style={{
        width: 260,
        minHeight: "100vh",
        background: "linear-gradient(180deg,#0f172a,#111118)",
        borderRight: `1px solid ${theme.border}`,
        padding: "28px 18px",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ marginBottom: 36 }}>
        <h2
          style={{
            fontSize: 28,
            letterSpacing: 2,
            background: theme.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          IRON FORGE
        </h2>
        <p
          style={{
            color: theme.textMuted,
            fontSize: 11,
            fontFamily: "'Space Mono', monospace",
            letterSpacing: 2,
          }}
        >
          {role === "ADMIN" ? "ADMIN CONTROL" : "MEMBER ZONE"}
        </p>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const active =
              pathname === item.path || pathname.startsWith(`${item.path}/`);

            return (
              <motion.div
                key={item.path}
                whileHover={{ x: 4 }}
                style={{ position: "relative" }}
              >
                {active && (
                  <motion.div
                    layoutId={`${role}-active-nav`}
                    style={{
                      position: "absolute",
                      left: -18,
                      top: 6,
                      bottom: 6,
                      width: 4,
                      borderRadius: 4,
                      background: theme.accent,
                    }}
                  />
                )}

                <button
                  onClick={() => router.push(item.path)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    marginBottom: 10,
                    borderRadius: 12,
                    border: active
                      ? `1px solid ${theme.accent}40`
                      : "1px solid transparent",
                    background: active ? `${theme.accent}15` : "transparent",
                    color: active ? theme.accent : theme.textSecondary,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      minWidth: 28,
                      height: 24,
                      borderRadius: 7,
                      display: "grid",
                      placeItems: "center",
                      background: active ? `${theme.accent}20` : theme.surfaceAlt,
                      fontSize: 10,
                      fontWeight: 900,
                    }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              </motion.div>
            );
          })}
      </nav>

      <motion.button
        whileHover={{ scale: 1.03 }}
        onClick={handleLogout}
        style={{
          padding: "12px 0",
          borderRadius: 12,
          background: `${theme.danger}15`,
          color: theme.danger,
          border: `1px solid ${theme.danger}40`,
          cursor: "pointer",
          fontFamily: "'Space Mono', monospace",
          fontSize: 13,
        }}
      >
        LOGOUT
      </motion.button>
    </aside>
  );
}
