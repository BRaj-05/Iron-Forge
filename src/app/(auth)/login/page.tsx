"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/FormField";
import { homepageImages } from "@/lib/cloudinary";
import { theme } from "@/lib/theme";
import { useAuth } from "@/features/auth/AuthProvider";
import { loginDestination } from "@/lib/routing";
import { apiRoutes } from "@/config/api-routes";

type LoginField = "email" | "password";

const demoAccounts = [
  { label: "Owner", email: "owner@gym.com", password: "owner12345" },
  { label: "Trainer", email: "trainer@gym.com", password: "trainer12345" },
  { label: "Customer", email: "customer@gym.com", password: "customer12345" },
];

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: LoginField, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleLogin() {
    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(apiRoutes.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed");
        return;
      }

      signIn(data.user);
      router.replace(loginDestination(data.user.role, new URLSearchParams(window.location.search).get("next")));
      router.refresh();
    } catch {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="if-auth-page" style={styles.page}>
      <div style={styles.backdrop} />

      <motion.section
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="if-auth-visual" style={styles.visualPanel}
      >
        <div style={styles.visualShade} />
        <div style={styles.visualContent}>
          <p style={styles.kicker}>MEMBER ACCESS</p>
          <h1 style={styles.visualTitle}>
            One login for workouts, rank, scores, and streaks.
          </h1>
          <div style={styles.metricRow}>
            <span>Daily Score</span>
            <strong>92/100</strong>
          </div>
          <div style={styles.metricRow}>
            <span>Active Missions</span>
            <strong>7</strong>
          </div>
          <div style={styles.metricRow}>
            <span>Weekly Rank</span>
            <strong>#14</strong>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.loginCard}
      >
        <div style={styles.topBar} />

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <motion.div whileHover={{ rotate: 8, scale: 1.04 }} style={styles.logoMark}>
            <Logo size={60} />
          </motion.div>

          <h1 style={styles.brandTitle}>IRON FORGE</h1>
          <p style={styles.brandSub}>AI GYM MANAGEMENT SYSTEM</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        {([
          { key: "email" as const, label: "Email address", placeholder: "customer@gym.com", type: "email" },
          { key: "password" as const, label: "Password", placeholder: "Enter password", type: "password" },
        ]).map((field) => (
          <Input
            key={field.key}
            label={field.label}
            type={field.type}
            value={form[field.key]}
            onChange={(event) => updateField(field.key, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleLogin();
            }}
            placeholder={field.placeholder}
            style={styles.field}
          />
        ))}

        <Button
          disabled={loading}
          onClick={handleLogin}
          style={{
            ...styles.loginButton,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "AUTHENTICATING..." : "ENTER THE FORGE"}
        </Button>

        <div style={styles.demoGrid}>
          {demoAccounts.map((account) => (
            <Button
              key={account.email}
              type="button"
              onClick={() =>
                setForm({ email: account.email, password: account.password })
              }
              variant="secondary"
              style={styles.demoButton}
            >
              Use {account.label}
            </Button>
          ))}
        </div>

        <div style={styles.footerLinks}>
          <span style={{ color: theme.textSecondary }}>
            New here?{" "}
            <Button variant="ghost" onClick={() => router.push("/signup")} style={styles.inlineButton}>
              Create Account
            </Button>
          </span>

          <Button
            onClick={() => router.push("/forgot-password")}
            variant="ghost"
            style={styles.inlineButton}
          >
            Forgot?
          </Button>
        </div>
      </motion.section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: theme.bg,
    display: "grid",
    gridTemplateColumns: "minmax(360px, 0.95fr) minmax(360px, 520px)",
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
    padding: "40px clamp(20px, 6vw, 90px)",
    position: "relative",
    overflow: "hidden",
  },
  backdrop: {
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(ellipse at 20% 50%, ${theme.accent}14 0%, transparent 55%),
      radial-gradient(ellipse at 80% 20%, ${theme.green}10 0%, transparent 50%),
      linear-gradient(135deg, #0a0a0f 0%, #111118 100%)
    `,
    pointerEvents: "none",
  },
  visualPanel: {
    minHeight: 640,
    borderRadius: 28,
    border: `1px solid ${theme.border}`,
    backgroundImage: `url(${homepageImages.equipmentStrength})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 28px 80px rgba(0,0,0,0.38)",
  },
  visualShade: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.88)), radial-gradient(circle at 20% 20%, rgba(249,115,22,0.24), transparent 32%)",
  },
  visualContent: {
    position: "absolute",
    left: 32,
    right: 32,
    bottom: 32,
  },
  kicker: {
    color: theme.accent,
    fontFamily: "'Space Mono', monospace",
    fontSize: 11,
    letterSpacing: 4,
    fontWeight: 900,
  },
  visualTitle: {
    maxWidth: 620,
    color: "#fff",
    fontSize: "clamp(42px, 5vw, 76px)",
    lineHeight: 0.95,
    margin: "12px 0 24px",
  },
  metricRow: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid rgba(255,255,255,0.14)",
    padding: "13px 0",
    color: "rgba(255,255,255,0.78)",
  },
  loginCard: {
    width: "min(100%, 460px)",
    justifySelf: "center",
    background: "rgba(17, 17, 24, 0.94)",
    border: `1px solid ${theme.border}`,
    borderRadius: 20,
    padding: 36,
    position: "relative",
    overflow: "hidden",
    boxShadow: `0 24px 80px ${theme.accent}12`,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: theme.gradient,
  },
  logoMark: {
    width: 60,
    height: 60,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    margin: "0 auto 18px",
  },
  brandTitle: {
    color: theme.textPrimary,
    fontSize: 38,
    letterSpacing: 3,
    lineHeight: 1,
  },
  brandSub: {
    color: theme.textSecondary,
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 8,
    fontFamily: "'Space Mono', monospace",
  },
  errorBox: {
    background: "#ff4d4d20",
    border: "1px solid #ff4d4d50",
    color: "#ff8a8a",
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 12,
    textAlign: "center",
  },
  field: {
    marginBottom: 14,
  },
  loginButton: {
    width: "100%",
    fontSize: 18,
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: 16,
  },
  demoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    marginBottom: 18,
  },
  demoButton: {
    minHeight: 40,
    padding: "0 8px",
    fontSize: 12,
  },
  footerLinks: {
    borderTop: `1px solid ${theme.border}`,
    paddingTop: 16,
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    fontSize: 12,
  },
  inlineButton: {
    color: theme.accent,
    fontWeight: 700,
    minHeight: 0,
    padding: 0,
    boxShadow: "none",
  },
};
