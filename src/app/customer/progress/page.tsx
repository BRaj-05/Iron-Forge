"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CSSProperties } from "react";
import { theme } from "@/lib/theme";

const weeklyData = [
  { day: "Mon", xp: 35, score: 72 },
  { day: "Tue", xp: 50, score: 84 },
  { day: "Wed", xp: 28, score: 61 },
  { day: "Thu", xp: 62, score: 92 },
  { day: "Fri", xp: 48, score: 80 },
  { day: "Sat", xp: 70, score: 96 },
  { day: "Sun", xp: 42, score: 76 },
];

const bodyData = [
  { week: "W1", weight: 82, waist: 36 },
  { week: "W2", weight: 81.4, waist: 35.6 },
  { week: "W3", weight: 80.9, waist: 35.2 },
  { week: "W4", weight: 80.2, waist: 34.8 },
];

export default function CustomerProgressPage() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>PROGRESS LAB</p>
        <h1 style={styles.title}>The mirror is emotional. Data is calmer.</h1>
        <p style={styles.copy}>
          Track XP, daily score, body changes, attendance, and recovery together
          so progress becomes easier to understand.
        </p>
      </section>

      <section style={styles.stats}>
        <Stat label="Weekly XP" value="335" accent={theme.gold} />
        <Stat label="Avg Score" value="80" accent={theme.green} />
        <Stat label="Weight Trend" value="-1.8kg" accent={theme.accent} />
        <Stat label="Waist Trend" value="-1.2in" accent="#38BDF8" />
      </section>

      <section style={styles.chartGrid}>
        <div style={styles.panel}>
          <p style={styles.eyebrow}>XP RHYTHM</p>
          <h2 style={styles.sectionTitle}>This week</h2>
          <div style={styles.chart}>
            <AreaChart width={620} height={300} data={weeklyData}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="day" stroke={theme.textSecondary} />
              <YAxis stroke={theme.textSecondary} />
              <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}` }} />
              <Area type="monotone" dataKey="xp" stroke={theme.gold} fill="rgba(251,191,36,0.18)" />
            </AreaChart>
          </div>
        </div>
        <div style={styles.panel}>
          <p style={styles.eyebrow}>BODY TREND</p>
          <h2 style={styles.sectionTitle}>Monthly check</h2>
          <div style={styles.chart}>
            <BarChart width={620} height={300} data={bodyData}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="week" stroke={theme.textSecondary} />
              <YAxis stroke={theme.textSecondary} />
              <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}` }} />
              <Bar dataKey="weight" fill={theme.accent} radius={[8, 8, 0, 0]} />
              <Bar dataKey="waist" fill={theme.green} radius={[8, 8, 0, 0]} />
            </BarChart>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{ ...styles.stat, borderTopColor: accent }}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { padding: 32 },
  hero: { border: `1px solid ${theme.border}`, borderRadius: 28, padding: 34, marginBottom: 22, background: "linear-gradient(135deg,#111118,#071016)" },
  eyebrow: { color: theme.accent, fontSize: 10, letterSpacing: 4, fontWeight: 950 },
  title: { fontSize: "clamp(42px, 6vw, 82px)", lineHeight: 0.95, maxWidth: 920, margin: "12px 0" },
  copy: { color: theme.textSecondary, lineHeight: 1.75, maxWidth: 760 },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 18 },
  stat: { border: `1px solid ${theme.border}`, borderTop: "4px solid", borderRadius: 18, background: theme.surface, padding: 20, display: "grid", gap: 8 },
  chartGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  panel: { border: `1px solid ${theme.border}`, borderRadius: 24, background: theme.surface, padding: 24 },
  sectionTitle: { fontSize: 38, margin: "8px 0 18px" },
  chart: { height: 320, overflowX: "auto", overflowY: "hidden" },
};
