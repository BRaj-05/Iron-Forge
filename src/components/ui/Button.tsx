"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { theme } from "@/lib/theme";

type ButtonVariant = "primary" | "secondary" | "ghost" | "success" | "danger";

type ButtonProps = Omit<HTMLMotionProps<"button">, "style"> & {
  children: ReactNode;
  variant?: ButtonVariant;
  style?: CSSProperties;
};

const variants: Record<ButtonVariant, CSSProperties> = {
  primary: { border: "none", background: theme.gradient, color: "#fff" },
  secondary: { border: `1px solid ${theme.border}`, background: theme.surfaceAlt, color: theme.textPrimary },
  ghost: { border: `1px solid transparent`, background: "transparent", color: theme.textSecondary },
  success: { border: "none", background: theme.gradientGreen, color: "#fff" },
  danger: { border: `1px solid ${theme.danger}55`, background: `${theme.danger}14`, color: theme.danger },
};

export default function Button({ children, variant = "primary", style, disabled, ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={{ y: disabled ? 0 : -1 }}
      disabled={disabled}
      style={{
        minHeight: 46,
        borderRadius: 10,
        padding: "0 16px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 950,
        opacity: disabled ? 0.62 : 1,
        boxShadow: variant === "primary" || variant === "success" ? "0 14px 34px rgba(249,115,22,0.18)" : undefined,
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
