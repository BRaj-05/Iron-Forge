"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { PLAN_IMAGE_URLS } from "@/lib/media";
import { theme } from "@/lib/theme";
import { apiRoutes } from "@/config/api-routes";

const plans = [
  { key: "ELITE", name: "Elite", price: "₹2,499", duration: "30 days", detail: "Full gym access, attendance, daily logs, rank, and support.", features: ["Gym access", "Daily score", "Trainer support"] },
  { key: "PRO", name: "Pro", price: "₹5,999", duration: "90 days", detail: "Best for transformation cycles with better renewal value.", features: ["Everything in Elite", "Progress review", "Diet history"] },
  { key: "SELECT", name: "Select", price: "₹14,999", duration: "365 days", detail: "Annual access for long-term members and serious consistency.", features: ["Everything in Pro", "Priority sessions", "Annual savings"] },
];

const comparison = [
  { feature: "Attendance tracking", elite: true, pro: true, select: true },
  { feature: "Workout and diet logs", elite: true, pro: true, select: true },
  { feature: "Trainer review", elite: "Basic", pro: "Advanced", select: "Priority" },
  { feature: "Owner support requests", elite: true, pro: true, select: true },
  { feature: "Priority trainer sessions", elite: false, pro: true, select: true },
  { feature: "Annual savings", elite: false, pro: false, select: true },
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
      const res = await fetch(apiRoutes.customer.paymentsVerify, {
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
      const res = await fetch(apiRoutes.customer.paymentsCheckout, {
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
      <Card style={styles.hero}>
        <p style={styles.eyebrow}>MEMBERSHIP PAYMENTS</p>
        <h1 style={styles.title}>Choose the plan that keeps you showing up.</h1>
        <p style={styles.copy}>
          Checkout is ready with a working mock payment fallback today, and the
          same structure can connect to Razorpay or Stripe later.
        </p>
      </Card>

      {message && <Card accent={theme.gold} style={styles.message}>{message}</Card>}

      <section style={styles.grid}>
        {plans.map((plan, index) => (
          <Card key={plan.key} accent={index === 1 ? theme.accent : undefined} style={{ ...styles.card, transform: index === 1 ? "translateY(-10px)" : undefined }}>
            <div style={{ ...styles.photo, backgroundImage: `linear-gradient(180deg, rgba(10,10,15,0.1), rgba(10,10,15,0.86)), url(${PLAN_IMAGE_URLS[plan.key]})` }}>
              <span>{plan.duration}</span>
            </div>
            <div style={styles.planTop}>
              <p style={styles.planLabel}>{plan.name}</p>
              {index === 1 && <span style={styles.badge}>Most popular</span>}
            </div>
            <h2>{plan.price}</h2>
            <p>{plan.detail}</p>
            <div style={styles.features}>
              {plan.features.map((feature) => <span key={feature}>+ {feature}</span>)}
            </div>
            <Button onClick={() => startCheckout(plan.key)} disabled={loadingPlan === plan.key}>
              {loadingPlan === plan.key ? "Creating..." : "Start checkout"}
            </Button>
          </Card>
        ))}
      </section>

      <Card style={styles.compare}>
        <p style={styles.eyebrow}>COMPARE</p>
        <h2 style={styles.sectionTitle}>Find your fit</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead style={styles.tableHead}>
              <tr>
                <th style={styles.headerCell}>Feature</th>
                <th style={styles.headerCell}>Elite</th>
                <th style={{ ...styles.headerCell, ...styles.proCell }}>Pro <span style={styles.smallBadge}>Recommended</span></th>
                <th style={styles.headerCell}>Select</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, rowIndex) => (
                <tr key={row.feature} style={rowIndex % 2 ? styles.altRow : undefined}>
                  <td style={{ ...styles.cell, color: "#fff" }}>{row.feature}</td>
                  <td style={styles.cell}>{renderFeature(row.elite)}</td>
                  <td style={{ ...styles.cell, ...styles.proCell }}>{renderFeature(row.pro)}</td>
                  <td style={styles.cell}>{renderFeature(row.select)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function renderFeature(value: boolean | string) {
  if (value === true) return <span style={styles.check}>✓</span>;
  if (value === false) return <span style={styles.xMark}>×</span>;
  return <span style={styles.textValue}>{value}</span>;
}

const styles: Record<string, CSSProperties> = {
  page: { padding: 32 },
  hero: { padding: 30, marginBottom: 22, background: "radial-gradient(circle at 86% 18%, rgba(251,191,36,0.18), transparent 28%), #0d0f14" },
  eyebrow: { color: theme.gold, fontSize: 10, letterSpacing: 4, fontWeight: 950 },
  title: { fontSize: "clamp(34px, 5vw, 66px)", lineHeight: 1, maxWidth: 980, margin: "12px 0" },
  copy: { color: theme.textSecondary, lineHeight: 1.75, maxWidth: 820 },
  message: { background: `${theme.gold}12`, color: theme.gold, padding: 14, marginBottom: 18 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18, alignItems: "stretch" },
  card: { padding: 18, display: "grid", gap: 12, transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease" },
  photo: { minHeight: 180, borderRadius: 8, backgroundSize: "cover", backgroundPosition: "center", display: "grid", alignContent: "end", padding: 16 },
  planTop: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" },
  planLabel: { color: theme.accent, letterSpacing: 3, fontWeight: 950 },
  badge: { border: `1px solid ${theme.accent}66`, borderRadius: 999, color: theme.gold, padding: "5px 8px", fontSize: 11, fontWeight: 950 },
  features: { display: "grid", gap: 8, color: theme.textSecondary },
  compare: { marginTop: 24, padding: 24 },
  sectionTitle: { fontSize: 36, margin: "8px 0 18px" },
  table: { width: "100%", minWidth: 760, borderCollapse: "separate", borderSpacing: 0 },
  tableHead: { position: "sticky", top: 76, zIndex: 1, background: theme.surface },
  headerCell: { padding: "14px 12px", textAlign: "left", color: "#fff", borderBottom: `1px solid ${theme.border}`, fontWeight: 950 },
  cell: { padding: "15px 12px", borderBottom: `1px solid ${theme.border}`, color: theme.textSecondary, fontWeight: 850 },
  altRow: { background: "rgba(255,255,255,0.028)" },
  proCell: { background: "rgba(249,115,22,0.06)", borderLeft: `1px solid ${theme.accent}33`, borderRight: `1px solid ${theme.accent}33` },
  check: { color: theme.green, fontSize: 22, fontWeight: 950 },
  xMark: { color: theme.textMuted, fontSize: 22, fontWeight: 950 },
  textValue: { color: theme.textSecondary },
  smallBadge: { marginLeft: 8, borderRadius: 999, border: `1px solid ${theme.accent}66`, padding: "3px 7px", color: theme.gold, fontSize: 10 },
};
