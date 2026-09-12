"use client";

import { useState } from "react";
import GlowCard from "@/components/ui/GlowCard";
import { theme } from "@/components/theme";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  async function handleReset() {
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    alert("If account exists, reset link sent.");
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: theme.bg,
    }}>
      <GlowCard>
        <h2 style={{ marginBottom: 20, color: theme.textPrimary }}>
          Reset Password
        </h2>

        <input
          placeholder="Enter your email"
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
            borderRadius: 8,
            border: `1px solid ${theme.border}`,
            background: theme.surface,
            color: theme.textPrimary,
          }}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleReset}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "none",
            background: theme.gradient,
            color: "#fff",
          }}
        >
          Send Reset Link
        </button>
      </GlowCard>
    </div>
  );
}