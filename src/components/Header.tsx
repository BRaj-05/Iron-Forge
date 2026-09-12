"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {theme }from "@/lib/theme";

interface SidebarProps {
  role: "ADMIN" | "CUSTOMER";
}

const navItems = [
  { label: "Dashboard", icon: "⚡", path: "/admin/dashboard", roles: ["ADMIN"] },
  { label: "Members", icon: "👥", path: "/admin/members", roles: ["ADMIN"] },
  { label: "Analytics", icon: "📊", path: "/admin/analytics", roles: ["ADMIN"] },

  { label: "Dashboard", icon: "⚡", path: "/customer/dashboard", roles: ["CUSTOMER"] },
  { label: "Workouts", icon: "🏋️", path: "/customer/todos", roles: ["CUSTOMER"] },
  { label: "Leaderboard", icon: "🏆", path: "/customer/leaderboard", roles: ["CUSTOMER"] },
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
        width: 240,
        background: theme.surface,
        borderRight: `1px solid ${theme.border}`,
        padding: "24px 0",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 24px 32px" }}>
        <h2
          style={{
            color: theme.textPrimary,
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 24,
            letterSpacing: 2,
          }}
        >
          IRON FORGE
        </h2>
        <p
          style={{
            color: theme.accent,
            fontSize: 11,
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {role}
        </p>
      </div>

      {/* Navigation */}
      <nav style={{ padding: "0 12px" }}>
        {navItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const active = pathname === item.path;

            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 4 }}
                onClick={() => router.push(item.path)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  marginBottom: 6,
                  borderRadius: 10,
                  border: "none",
                  background: active
                    ? `${theme.accent}20`
                    : "transparent",
                  color: active
                    ? theme.accent
                    : theme.textSecondary,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                }}
              >
                {item.icon} {item.label}
              </motion.button>
            );
          })}
      </nav>

      {/* Logout */}
      <div style={{ padding: 16, marginTop: "auto" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "8px 0",
            borderRadius: 8,
            background: `${theme.danger}15`,
            color: theme.danger,
            border: `1px solid ${theme.danger}40`,
            cursor: "pointer",
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
          }}
        >
          LOGOUT
        </button>
      </div>
    </aside>
  );
}