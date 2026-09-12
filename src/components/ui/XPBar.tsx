"use client";
import { motion } from "framer-motion";
import { theme } from "../theme";

export default function XPBar({ xp, level }: { xp: number; level: number }) {
  const pct = xp % 100;

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: theme.textSecondary,
          fontSize: 11,
          marginBottom: 6,
        }}
      >
        <span>Level {level}</span>
        <span>{pct}/100 XP</span>
      </div>
      <div
        style={{
          background: theme.border,
          borderRadius: 99,
          height: 6,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1 }}
          style={{
            height: "100%",
            background: theme.gradient,
          }}
        />
      </div>
    </div>
  );
}
