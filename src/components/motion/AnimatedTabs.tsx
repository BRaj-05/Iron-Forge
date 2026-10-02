"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { theme } from "@/lib/theme";

export type AnimatedTab = {
  label: string;
  href: string;
};

export default function AnimatedTabs({ tabs, activePath, style }: { tabs: AnimatedTab[]; activePath: string; style?: CSSProperties }) {
  return (
    <nav aria-label="Member navigation" style={{ ...styles.wrap, ...style }}>
      {tabs.map((tab) => {
        const active = activePath === tab.href || activePath.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              ...styles.link,
              color: active ? "#fff" : "rgba(255,255,255,0.68)",
              borderColor: active ? "rgba(249,115,22,0.52)" : "transparent",
            }}
          >
            {active && <motion.span layoutId="if-tab-pill" style={styles.active} />}
            <span style={{ position: "relative", zIndex: 1 }}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minWidth: 0,
    overflowX: "auto",
    padding: 5,
    borderRadius: 999,
    border: `1px solid ${theme.border}`,
    background: "rgba(255,255,255,0.04)",
    scrollbarWidth: "none",
  },
  link: {
    position: "relative",
    overflow: "hidden",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 34,
    padding: "0 12px",
    borderRadius: 999,
    border: "1px solid transparent",
    textDecoration: "none",
    fontSize: 11,
    fontWeight: 900,
    whiteSpace: "nowrap",
  },
  active: {
    position: "absolute",
    inset: 0,
    borderRadius: 999,
    background: "linear-gradient(135deg, rgba(249,115,22,0.34), rgba(251,191,36,0.16))",
  },
};
