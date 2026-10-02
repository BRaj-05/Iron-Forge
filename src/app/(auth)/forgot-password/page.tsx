"use client";

import { useState } from "react";
import { apiRoutes } from "@/config/api-routes";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/FormField";
import { theme } from "@/lib/theme";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  async function handleReset() {
    await fetch(apiRoutes.auth.forgotPassword, {
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
      <Card style={{ width: "min(100%, 440px)", display: "grid", gap: 14 }}>
        <h2 style={{ marginBottom: 20, color: theme.textPrimary }}>
          Reset Password
        </h2>

        <Input
          label="Email address"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          onClick={handleReset}
          style={{ width: "100%" }}
        >
          Send Reset Link
        </Button>
      </Card>
    </div>
  );
}
