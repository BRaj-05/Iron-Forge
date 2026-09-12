"use client";

import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import CustomerSupportFooter from "@/components/CustomerSupportFooter";
import { theme } from "@/lib/theme";

const memberLinks = [
  { label: "Home", href: "/customer/dashboard" },
  { label: "Workouts", href: "/customer/workouts" },
  { label: "Diet", href: "/customer/diet" },
  { label: "Progress", href: "/customer/progress" },
  { label: "Sessions", href: "/customer/sessions" },
  { label: "Payments", href: "/customer/payments" },
  { label: "Rank", href: "/customer/leaderboard" },
];

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/gym?search=${encodeURIComponent(value)}` : "/gym");
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

        <form onSubmit={handleSearch} style={styles.search}>
          <input
            aria-label="Search exercises"
            placeholder="Search exercises"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>Search</button>
        </form>

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
      <CustomerSupportFooter />
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
    minHeight: 86,
    padding: "14px 22px",
    display: "grid",
    gridTemplateColumns: "190px minmax(260px, 1fr) minmax(220px, 300px) auto",
    alignItems: "center",
    gap: 16,
    position: "sticky",
    top: 0,
    zIndex: 30,
    background: "rgba(6,7,10,0.9)",
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
    borderRadius: 8,
    display: "grid",
    placeItems: "center",
    background: theme.gradient,
    fontWeight: 900,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 900,
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    overflowX: "auto",
    minWidth: 0,
    scrollbarWidth: "none",
    paddingBottom: 4,
  },
  linkGroup: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
    padding: 5,
    border: `1px solid ${theme.border}`,
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
  },
  memberLink: {
    position: "relative",
    overflow: "hidden",
    display: "inline-flex",
    textDecoration: "none",
    border: "1px solid transparent",
    borderRadius: 999,
    padding: "9px 12px",
    fontSize: 11,
    fontWeight: 850,
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },
  search: {
    minHeight: 44,
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 6,
    border: `1px solid ${theme.border}`,
    borderRadius: 999,
    padding: 5,
    background: "rgba(255,255,255,0.055)",
  },
  searchInput: {
    minWidth: 0,
    border: "none",
    background: "transparent",
    color: theme.textPrimary,
    padding: "0 12px",
    fontWeight: 800,
  },
  searchButton: {
    border: "none",
    borderRadius: 999,
    background: theme.gradient,
    color: "#fff",
    padding: "0 14px",
    fontWeight: 950,
    cursor: "pointer",
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
    borderRadius: 8,
    padding: "11px 16px",
    cursor: "pointer",
    fontWeight: 900,
  },
  content: {
    maxWidth: 1600,
    margin: "0 auto",
  },
};
