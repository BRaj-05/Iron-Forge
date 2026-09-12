"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { PLAN_IMAGE_URLS } from "@/lib/media";
import { theme } from "@/lib/theme";

const plans = [
  { key: "ELITE", name: "Elite", price: "₹2,499", duration: "30 days", detail: "Full gym access, attendance, daily logs, rank, and support.", features: ["Gym access", "Daily score", "Trainer support"] },
  { key: "PRO", name: "Pro", price: "₹5,999", duration: "90 days", detail: "Best for transformation cycles with better renewal value.", features: ["Everything in Elite", "Progress review", "Diet history"] },
  { key: "SELECT", name: "Select", price: "₹14,999", duration: "365 days", detail: "Annual access for long-term members and serious consistency.", features: ["Everything in Pro", "Priority sessions", "Annual savings"] },
];

const comparison = [
  ["Feature", "Elite", "Pro", "Select"],
  ["Attendance tracking", "Yes", "Yes", "Yes"],
  ["Workout and diet logs", "Yes", "Yes", "Yes"],
  ["Trainer review", "Basic", "Advanced", "Priority"],
  ["Owner support requests", "Yes", "Yes", "Yes"],
];

export default function CustomerPaymentsPage() {
  const [loadingPlan, setLoadingPlan] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get("mockPaymentId");
    const planId = params.get("planId");
    if (!paymentId || !planId) return;

    async function verifyPayment() {
      setMessage("Verifying payment...");
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, planId }),
      });
      const data = await res.json();
      setMessage(res.ok ? data.message : data.error || "Payment verification failed.");
      window.history.replaceState(null, "", "/customer/payments");
    }

    void verifyPayment();
  }, []);

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
        <h1 style={styles.title}>Choose the plan that keeps you showing up.</h1>
        <p style={styles.copy}>
          Checkout is ready with a working mock payment fallback today, and the
          same structure can connect to Razorpay or Stripe later.
        </p>
      </section>

      {message && <div style={styles.message}>{message}</div>}

      <section style={styles.grid}>
        {plans.map((plan, index) => (
          <article key={plan.key} style={{ ...styles.card, transform: index === 1 ? "translateY(-10px)" : undefined }}>
            <div style={{ ...styles.photo, backgroundImage: `linear-gradient(180deg, rgba(10,10,15,0.1), rgba(10,10,15,0.86)), url(${PLAN_IMAGE_URLS[plan.key]})` }}>
              <span>{plan.duration}</span>
            </div>
            <p style={styles.planLabel}>{plan.name}</p>
            <h2>{plan.price}</h2>
            <p>{plan.detail}</p>
            <div style={styles.features}>
              {plan.features.map((feature) => <span key={feature}>+ {feature}</span>)}
            </div>
            <button onClick={() => startCheckout(plan.key)} disabled={loadingPlan === plan.key} style={styles.button}>
              {loadingPlan === plan.key ? "Creating..." : "Start checkout"}
            </button>
          </article>
        ))}
      </section>

      <section style={styles.compare}>
        <p style={styles.eyebrow}>COMPARE</p>
        <h2 style={styles.sectionTitle}>Find your fit</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <tbody>
              {comparison.map((row, rowIndex) => (
                <tr key={row[0]}>
                  {row.map((cell, index) => (
                    <td key={`${row[0]}-${cell}`} style={{ ...styles.cell, color: rowIndex === 0 || index === 0 ? "#fff" : theme.textSecondary }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { padding: 32 },
  hero: { border: `1px solid ${theme.border}`, borderRadius: 14, padding: 30, marginBottom: 22, background: "radial-gradient(circle at 86% 18%, rgba(251,191,36,0.18), transparent 28%), #0d0f14" },
  eyebrow: { color: theme.gold, fontSize: 10, letterSpacing: 4, fontWeight: 950 },
  title: { fontSize: "clamp(34px, 5vw, 66px)", lineHeight: 1, maxWidth: 980, margin: "12px 0" },
  copy: { color: theme.textSecondary, lineHeight: 1.75, maxWidth: 820 },
  message: { border: `1px solid ${theme.gold}55`, background: `${theme.gold}12`, color: theme.gold, borderRadius: 8, padding: 14, marginBottom: 18 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18, alignItems: "stretch" },
  card: { border: `1px solid ${theme.border}`, borderRadius: 12, background: "linear-gradient(145deg, rgba(26,29,39,0.95), rgba(9,10,14,0.95))", padding: 18, display: "grid", gap: 12, transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease" },
  photo: { minHeight: 180, borderRadius: 8, backgroundSize: "cover", backgroundPosition: "center", display: "grid", alignContent: "end", padding: 16 },
  planLabel: { color: theme.accent, letterSpacing: 3, fontWeight: 950 },
  features: { display: "grid", gap: 8, color: theme.textSecondary },
  button: { border: "none", borderRadius: 8, background: theme.gradient, color: "#fff", padding: "13px 16px", cursor: "pointer", fontWeight: 950 },
  compare: { marginTop: 24, border: `1px solid ${theme.border}`, borderRadius: 12, background: theme.surface, padding: 24 },
  sectionTitle: { fontSize: 36, margin: "8px 0 18px" },
  table: { width: "100%", minWidth: 720, borderCollapse: "collapse" },
  cell: { padding: "15px 12px", borderBottom: `1px solid ${theme.border}`, fontWeight: 850 },
};
