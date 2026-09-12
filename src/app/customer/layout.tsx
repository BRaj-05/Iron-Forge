"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { theme } from "@/lib/theme";

const publicLinks = [
  { label: "Exercises", href: "/gym" },
  { label: "Yoga", href: "/yoga" },
  { label: "Nutrition", href: "/nutrition" },
  { label: "Equipment", href: "/equipment" },
  { label: "Plans", href: "/plans" },
];

const memberLinks = [
  { label: "Home", href: "/customer/dashboard" },
  { label: "Workouts", href: "/customer/workouts" },
  { label: "Recovery", href: "/customer/yoga" },
  { label: "Diet", href: "/customer/diet" },
  { label: "Progress", href: "/customer/progress" },
  { label: "Sessions", href: "/customer/sessions" },
  { label: "Payments", href: "/customer/payments" },
  { label: "Coach", href: "/customer/ai-coach" },
  { label: "Tasks", href: "/customer/todos" },
  { label: "Calendar", href: "/customer/calendar" },
  { label: "Rank", href: "/customer/leaderboard" },
];

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <main style={styles.page}>
      <motion.header
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        style={styles.nav}
      >
        <Link href="/" style={styles.logo}>
          <span style={styles.logoMark}>IF</span>
          <span style={styles.logoText}>Iron Forge</span>
        </Link>

        <nav style={styles.navLinks}>
          <div style={styles.linkGroup}>
            {publicLinks.map((link) => (
              <Link key={link.href} href={link.href} style={styles.publicLink}>
                {link.label}
              </Link>
            ))}
          </div>
          <div style={styles.linkGroup}>
            {memberLinks.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <motion.div
                  key={link.href}
                  whileHover={{ y: -2 }}
                  style={{
                    position: "relative",
                  }}
                >
                  <Link
                    href={link.href}
                    style={{
                      ...styles.memberLink,
                      color: active ? "#fff" : "rgba(255,255,255,0.7)",
                      background: active
                        ? "rgba(249,115,22,0.2)"
                        : "rgba(255,255,255,0.04)",
                      borderColor: active
                        ? "rgba(249,115,22,0.58)"
                        : "rgba(255,255,255,0.08)",
                    }}
                  >
                    {active && (
                      <motion.span
                        layoutId="customer-nav-glow"
                        style={styles.activeGlow}
                      />
                    )}
                    <span style={{ position: "relative", zIndex: 1 }}>
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          style={styles.logout}
        >
          Logout
        </motion.button>
      </motion.header>

      <section style={styles.content}>{children}</section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 80% 0%, rgba(249,115,22,0.12), transparent 28%), #0A0A0F",
    color: theme.textPrimary,
  },
  nav: {
    minHeight: 78,
    padding: "12px 24px",
    display: "grid",
    gridTemplateColumns: "210px minmax(0, 1fr) auto",
    alignItems: "center",
    gap: 18,
    position: "sticky",
    top: 0,
    zIndex: 30,
    background:
      "linear-gradient(90deg, rgba(10,10,15,0.94), rgba(17,17,24,0.88))",
    backdropFilter: "blur(22px)",
    borderBottom: `1px solid ${theme.border}`,
    boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#fff",
    textDecoration: "none",
  },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    background: theme.gradient,
    fontWeight: 900,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 900,
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
    overflowX: "auto",
    scrollbarWidth: "none",
    paddingBottom: 4,
  },
  linkGroup: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    flexShrink: 0,
    padding: 5,
    border: `1px solid ${theme.border}`,
    borderRadius: 999,
    background: "rgba(255,255,255,0.025)",
  },
  publicLink: {
    color: "rgba(255,255,255,0.56)",
    textDecoration: "none",
    fontSize: 12,
    fontWeight: 800,
    padding: "9px 11px",
    whiteSpace: "nowrap",
  },
  memberLink: {
    position: "relative",
    overflow: "hidden",
    display: "inline-flex",
    textDecoration: "none",
    border: "1px solid transparent",
    borderRadius: 999,
    padding: "9px 13px",
    fontSize: 12,
    fontWeight: 850,
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },
  activeGlow: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(249,115,22,0.3), rgba(251,191,36,0.12))",
    borderRadius: 999,
  },
  logout: {
    border: `1px solid ${theme.danger}45`,
    background: `${theme.danger}12`,
    color: theme.danger,
    borderRadius: 12,
    padding: "11px 16px",
    cursor: "pointer",
    fontWeight: 900,
  },
  content: {
    maxWidth: 1600,
    margin: "0 auto",
  },
};
