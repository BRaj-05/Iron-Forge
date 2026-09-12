"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import GlowCard from "@/components/ui/GlowCard";
import { theme } from "@/components/theme";

export default function ResetPassword() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleReset() {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Password reset successful");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setMessage(data.error);
    }
  }

  const wrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    border: `1px solid ${theme.accent}`,
    borderRadius: "4px",
    backgroundColor: theme.surface,
    color: theme.textPrimary,
    fontSize: "14px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: theme.accent,
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  };

  return (
    <div style={wrapperStyle}>
      <GlowCard accent={theme.accent}>
        <h2 style={{ marginBottom: 20, color: theme.textPrimary }}>
          Reset Password 🔐
        </h2>

        {message && (
          <div
            style={{
              marginBottom: 12,
              fontSize: 12,
              color: "#ff6b6b",
            }}
          >
            {message}
          </div>
        )}

        <input
          type="password"
          placeholder="New Password"
          style={inputStyle}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleReset} style={buttonStyle}>
          Reset Password
        </button>
      </GlowCard>
    </div>
  );
}
