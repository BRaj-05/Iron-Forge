"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  label?: string;
  title?: string;
  value?: ReactNode;
  icon?: ReactNode;
  accent?: string;
  delta?: ReactNode;
  children?: ReactNode;
}

export default function StatCard({
  label,
  title,
  value,
  icon,
  accent = "var(--accent)",
  delta,
  children,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      style={{
        background: "linear-gradient(145deg, var(--surface), #0f172a)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: 20,
        minHeight: 118,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0 auto auto 0",
          width: 3,
          height: "100%",
          background: accent,
        }}
      />

      {children || (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 12,
                marginBottom: 10,
              }}
            >
              {label || title}
            </p>
            {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
          </div>

          <p
            style={{
              color: "var(--text-primary)",
              fontSize: 30,
              fontWeight: 800,
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            {value}
          </p>

          {delta && (
            <p style={{ color: accent, fontSize: 11, fontWeight: 600 }}>
              {delta}
            </p>
          )}
        </>
      )}
    </motion.div>
  );
}
