"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { theme } from "@/lib/theme";

type CardProps = {
  children: ReactNode;
  accent?: string;
  style?: CSSProperties;
  className?: string;
};

export default function Card({ children, accent, style, className }: CardProps) {
  return (
    <motion.section
      className={className}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      style={{
        border: `1px solid ${accent ? `${accent}66` : theme.border}`,
        borderRadius: 12,
        background:
          "linear-gradient(145deg, rgba(26,29,39,0.96), rgba(12,13,19,0.96))",
        boxShadow: "0 16px 42px rgba(0,0,0,0.18)",
        padding: 20,
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        ...style,
      }}
    >
      {children}
    </motion.section>
  );
}
