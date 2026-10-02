"use client";

import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedTabs, { type AnimatedTab } from "@/components/motion/AnimatedTabs";
import Button from "@/components/ui/Button";
import { SearchField } from "@/components/ui/FormField";
import { Logo } from "@/components/layout/Logo";
import { theme } from "@/lib/theme";

type HeaderProps = {
  links: AnimatedTab[];
  actions?: ReactNode;
  showSearch?: boolean;
  onLogout?: () => void;
};

export default function Header({ links, actions, showSearch = false, onLogout }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = String(data.get("search") || "").trim();
    router.push(value ? `/gym?search=${encodeURIComponent(value)}` : "/gym");
  }

  return (
    <motion.header
      className="if-shared-header"
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={styles.nav}
    >
      <Link href="/" style={styles.logo} aria-label="Iron Forge home">
        <Logo />
        <span style={styles.logoText}>Iron Forge</span>
      </Link>

      <AnimatedTabs tabs={links} activePath={pathname} />

      <div className="if-shared-header-actions" style={styles.actions}>
        {showSearch && (
          <form onSubmit={handleSearch} style={styles.search}>
            <SearchField
              name="search"
              aria-label="Search exercises"
              placeholder="Search exercises"
            />
            <Button type="submit" style={styles.searchButton}>Search</Button>
          </form>
        )}
        {actions}
        {onLogout && (
          <Button variant="danger" onClick={onLogout}>
            Logout
          </Button>
        )}
      </div>
    </motion.header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    minHeight: 76,
    padding: "12px 22px",
    display: "grid",
    gridTemplateColumns: "220px minmax(260px, 1fr) auto",
    alignItems: "center",
    gap: 16,
    position: "sticky",
    top: 0,
    zIndex: 40,
    background: "rgba(6,7,10,0.91)",
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
    minWidth: 0,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 950,
    whiteSpace: "nowrap",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  },
  search: {
    width: "min(300px, 30vw)",
    minWidth: 220,
    minHeight: 44,
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 6,
    border: `1px solid ${theme.border}`,
    borderRadius: 999,
    padding: 5,
    background: "rgba(255,255,255,0.055)",
  },
  searchButton: {
    minHeight: 34,
    padding: "0 14px",
    borderRadius: 999,
  },
};
