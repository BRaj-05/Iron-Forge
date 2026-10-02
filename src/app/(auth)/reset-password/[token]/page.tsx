"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRoutes } from "@/config/api-routes";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/FormField";
import { theme } from "@/lib/theme";

export default function ResetPassword() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleReset() {
    const res = await fetch(apiRoutes.auth.resetPassword, {
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

  return (
    <div style={wrapperStyle}>
      <Card accent={theme.accent} style={{ width: "min(100%, 440px)", display: "grid", gap: 14 }}>
        <h2 style={{ marginBottom: 20, color: theme.textPrimary }}>
          Reset Password
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

        <Input
          label="New password"
          type="password"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleReset} style={{ width: "100%" }}>
          Reset Password
        </Button>
      </Card>
    </div>
  );
}
