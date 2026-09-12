"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CSSProperties } from "react";
import { theme } from "@/lib/theme";

type ProgressData = {
  weeklyXP: number;
  avgScore: number;
  weightTrend: number;
  level: number;
  streak: number;
  weekly: Array<{ day: string; logDate: string; xp: number; score: number }>;
  body: Array<{ week: string; weight: number; height: number }>;
};

const empty: ProgressData = { weeklyXP: 0, avgScore: 0, weightTrend: 0, level: 1, streak: 0, weekly: [], body: [] };

export default function CustomerProgressPage() {
  const [data, setData] = useState<ProgressData>(empty);

  useEffect(() => {
    fetch("/api/progress", { cache: "no-store" })
      .then((res) => res.json())
      .then((payload) => setData({ ...empty, ...payload }))
      .catch(() => setData(empty));
  }, []);

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>PROGRESS LAB</p>
        <h1 style={styles.title}>Progress from your daily check-ins.</h1>
        <p style={styles.copy}>
          Attendance, workout logs, diet history, and body metrics now combine
          into XP and trend charts your trainer can review.
        </p>
      </section>

      <section style={styles.stats}>
        <Stat label="Weekly XP" value={String(data.weeklyXP)} accent={theme.gold} />
        <Stat label="Avg Score" value={String(data.avgScore)} accent={theme.green} />
        <Stat label="Weight Trend" value={`${data.weightTrend > 0 ? "+" : ""}${data.weightTrend}kg`} accent={theme.accent} />
        <Stat label="Streak Days" value={String(data.streak)} accent="#38BDF8" />
      </section>

      <section style={styles.chartGrid}>
        <div style={styles.panel}>
          <p style={styles.eyebrow}>XP RHYTHM</p>
          <h2 style={styles.sectionTitle}>This week</h2>
          <div style={styles.chart}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.weekly}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="day" stroke={theme.textSecondary} />
                <YAxis stroke={theme.textSecondary} />
                <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}` }} />
                <Area type="monotone" dataKey="xp" stroke={theme.gold} fill="rgba(251,191,36,0.18)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={styles.panel}>
          <p style={styles.eyebrow}>BODY TREND</p>
          <h2 style={styles.sectionTitle}>Saved metrics</h2>
          <div style={styles.chart}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.body.length ? data.body : [{ week: "Today", weight: 0, height: 0 }]}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="week" stroke={theme.textSecondary} />
                <YAxis stroke={theme.textSecondary} />
                <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}` }} />
                <Bar dataKey="weight" fill={theme.accent} radius={[8, 8, 0, 0]} />
                <Bar dataKey="height" fill={theme.green} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
  hero: { border: `1px solid ${theme.border}`, borderRadius: 18, padding: 30, marginBottom: 22, background: "linear-gradient(135deg,#111118,#071016)" },
  eyebrow: { color: theme.accent, fontSize: 10, letterSpacing: 4, fontWeight: 950 },
  title: { fontSize: "clamp(34px, 5vw, 64px)", lineHeight: 1, maxWidth: 920, margin: "12px 0" },
  copy: { color: theme.textSecondary, lineHeight: 1.75, maxWidth: 820 },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 18 },
  stat: { border: `1px solid ${theme.border}`, borderTop: "4px solid", borderRadius: 12, background: theme.surface, padding: 20, display: "grid", gap: 8 },
  chartGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18 },
  panel: { border: `1px solid ${theme.border}`, borderRadius: 16, background: theme.surface, padding: 24 },
  sectionTitle: { fontSize: 34, margin: "8px 0 18px" },
  chart: { height: 320 },
};
