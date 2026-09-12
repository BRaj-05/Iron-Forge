"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { theme } from "@/lib/theme";

const plans = [
  { key: "ELITE", name: "Elite", price: "₹2,499", duration: "30 days", detail: "Best for full gym access and habit building." },
  { key: "PRO", name: "Pro", price: "₹5,999", duration: "90 days", detail: "Best for serious transformation cycles." },
  { key: "SELECT", name: "Select", price: "₹14,999", duration: "365 days", detail: "Best for long-term members and annual savings." },
];

export default function CustomerPaymentsPage() {
  const [loadingPlan, setLoadingPlan] = useState("");
  const [message, setMessage] = useState("");

  async function startCheckout(plan: string) {
    setLoadingPlan(plan);
    setMessage("");

    try {
      const res = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Checkout could not be created.");
        return;
      }

      setMessage(`${data.provider} checkout ready for ${data.planName}. Redirecting...`);
      window.location.href = data.checkoutUrl;
    } catch {
      setMessage("Checkout could not start right now.");
    } finally {
      setLoadingPlan("");
    }
  }

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>MEMBERSHIP PAYMENTS</p>
        <h1 style={styles.title}>Upgrade access without making billing messy.</h1>
        <p style={styles.copy}>
          Phase 6 uses a mock checkout fallback so the flow works today. Add
          Stripe or Razorpay credentials later and this structure can become a
          real hosted checkout.
        </p>
      </section>

      {message && <div style={styles.message}>{message}</div>}

      <section style={styles.grid}>
        {plans.map((plan) => (
          <article key={plan.key} style={styles.card}>
            <p style={styles.planLabel}>{plan.name}</p>
            <h2>{plan.price}</h2>
            <span>{plan.duration}</span>
            <p>{plan.detail}</p>
            <button
              onClick={() => startCheckout(plan.key)}
              disabled={loadingPlan === plan.key}
              style={styles.button}
            >
              {loadingPlan === plan.key ? "Creating..." : "Start Checkout"}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { padding: 32 },
  hero: { border: `1px solid ${theme.border}`, borderRadius: 28, padding: 34, marginBottom: 22, background: "radial-gradient(circle at 85% 16%, rgba(251,191,36,0.2), transparent 28%), #111118" },
  eyebrow: { color: theme.gold, fontSize: 10, letterSpacing: 4, fontWeight: 950 },
  title: { fontSize: "clamp(42px, 6vw, 82px)", lineHeight: 0.95, maxWidth: 980, margin: "12px 0" },
  copy: { color: theme.textSecondary, lineHeight: 1.75, maxWidth: 820 },
  message: { border: `1px solid ${theme.gold}55`, background: `${theme.gold}12`, color: theme.gold, borderRadius: 14, padding: 14, marginBottom: 18 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 },
  card: { border: `1px solid ${theme.border}`, borderRadius: 24, background: theme.surface, padding: 24, display: "grid", gap: 12 },
  planLabel: { color: theme.accent, letterSpacing: 3, fontWeight: 950 },
  button: { border: "none", borderRadius: 14, background: theme.gradient, color: "#fff", padding: "13px 16px", cursor: "pointer", fontWeight: 950 },
};
