"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

export default function FadeInSection({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={style}
    >
      {children}
    </motion.section>
  );
}
