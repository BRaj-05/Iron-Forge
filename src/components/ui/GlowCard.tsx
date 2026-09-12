"use client";

import type { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  accent?: string;
  style?: React.CSSProperties;
}

export default function GlowCard({
  children,
  accent = "var(--accent)",
  style,
}: GlowCardProps) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 24,
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 0 24px ${accent}18`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: accent,
        }}
      />
      {children}
    </div>
  );
}
