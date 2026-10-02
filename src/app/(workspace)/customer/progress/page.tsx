"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CSSProperties } from "react";
import { Logo } from "@/components/layout/Logo";
import { CountUp } from "@/components/motion/CountUp";
import Card from "@/components/ui/Card";
import { theme } from "@/lib/theme";
import { apiRoutes } from "@/config/api-routes";
import FormProgress from "@/modules/ai-coach/FormProgress";

type ProgressData = {
  weeklyXP: number;
  totalXP: number;
  avgScore: number;
  weightTrend: number;
  level: number;
  streak: number;
  weekly: Array<{ day: string; logDate: string; xp: number; score: number }>;
  body: Array<{ week: string; weight: number; height: number }>;
};

const empty: ProgressData = { weeklyXP: 0, totalXP: 0, avgScore: 0, weightTrend: 0, level: 1, streak: 0, weekly: [], body: [] };

export default function CustomerProgressPage() {
  const [data, setData] = useState<ProgressData>(empty);

  useEffect(() => {
    fetch(apiRoutes.customer.progress, { cache: "no-store" })
      .then((res) => res.json())
      .then((payload) => setData({ ...empty, ...payload }))
      .catch(() => setData(empty));
  }, []);

  const hasProgress = (data.totalXP || data.weeklyXP) > 0 || data.body.some((item) => item.weight || item.height);

  return (
    <div style={styles.page}>
      <Card style={styles.hero}>
        <p style={styles.eyebrow}>PROGRESS LAB</p>
        <h1 style={styles.title}>Progress</h1>
        <p style={styles.copy}>
          Track performance, consistency and form.
        </p>
      </Card>

      <section style={styles.stats}>
        <Stat label="Total XP" value={data.totalXP || data.weeklyXP} accent={theme.gold} />
        <Stat label="Avg Score" value={data.avgScore} accent={theme.green} />
        <Stat label="Weight Trend" value={data.weightTrend} suffix="kg" signed accent={theme.accent} />
        <Stat label="Streak Days" value={data.streak} accent="#38BDF8" />
      </section>

      {hasProgress ? (
        <section style={styles.chartGrid}>
          <Card style={styles.panel}>
            <p style={styles.eyebrow}>XP RHYTHM</p>
            <h2 style={styles.sectionTitle}>This week</h2>
            <div style={styles.chart}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.weekly}>
                  <CartesianGrid stroke="rgba(35,33,30,0.08)" />
                  <XAxis dataKey="day" stroke="#8a877f" />
                  <YAxis stroke="#8a877f" />
                  <Tooltip contentStyle={{ background: "#fff", color: "#292825", border: "1px solid #dfdcd4", borderRadius: 10 }} />
                  <Area isAnimationActive type="monotone" dataKey="xp" stroke={theme.gold} fill="rgba(251,191,36,0.18)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card style={styles.panel}>
            <p style={styles.eyebrow}>BODY TREND</p>
            <h2 style={styles.sectionTitle}>Saved metrics</h2>
            <div style={styles.chart}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.body}>
                  <CartesianGrid stroke="rgba(35,33,30,0.08)" />
                  <XAxis dataKey="week" stroke="#8a877f" />
                  <YAxis stroke="#8a877f" />
                  <Tooltip contentStyle={{ background: "#fff", color: "#292825", border: "1px solid #dfdcd4", borderRadius: 10 }} />
                  <Bar isAnimationActive dataKey="weight" fill="var(--accent)" radius={[8, 8, 0, 0]} />
                  <Bar isAnimationActive dataKey="height" fill="var(--green)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>
      ) : (
        <Card style={styles.emptyState}>
          <div style={styles.emptyIcon}><Logo size={48} /></div>
          <h2>Log your first workout to see progress here.</h2>
          <p>Attendance, workouts, diet, and body metrics will turn into XP charts once you save your first daily log.</p>
          <Link href="/customer/workouts" style={styles.emptyCta}>Open workouts</Link>
        </Card>
      )}
      <FormProgress />
    </div>
  );
}

function Stat({ label, value, accent, suffix = "", signed = false }: { label: string; value: number; accent: string; suffix?: string; signed?: boolean }) {
  const prefix = signed && value > 0 ? "+" : "";
  return (
    <Card accent={accent} style={{ ...styles.stat, borderTopColor: accent }}>
      <span>{label}</span>
      <strong>{prefix}<CountUp value={value} suffix={suffix} /></strong>
    </Card>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { padding: "clamp(20px, 3vw, 40px)", color: "#292825" },
  hero: { padding: "22px 24px", marginBottom: 18, border: "1px solid #dfdcd4", borderLeft: "4px solid #e8671d", background: "rgba(255,255,255,.78)", boxShadow: "none" },
  eyebrow: { color: theme.accent, fontSize: 10, letterSpacing: 4, fontWeight: 950 },
  title: { color: "#1c1b19", fontWeight: 800, fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.05, margin: "7px 0" },
  copy: { color: "#76736c", lineHeight: 1.5 },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 18 },
  stat: { minHeight: 112, borderTop: "3px solid", borderColor: "#dfdcd4", padding: 18, display: "grid", alignContent: "center", gap: 8, background: "rgba(255,255,255,.82)", color: "#292825", boxShadow: "none" },
  chartGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18 },
  panel: { padding: 24, borderColor: "#dfdcd4", background: "rgba(255,255,255,.78)", color: "#292825", boxShadow: "none" },
  sectionTitle: { color: "#292825", fontFamily: "Georgia, serif", fontWeight: 500, fontSize: 34, margin: "8px 0 18px" },
  chart: { height: 320 },
  emptyState: { padding: 32, display: "grid", justifyItems: "start", gap: 12, borderColor: "#dfdcd4", background: "rgba(255,255,255,.78)", color: "#76736c", boxShadow: "none" },
  emptyIcon: { width: 56, height: 56, borderRadius: 12, display: "grid", placeItems: "center", background: theme.gradient, color: "#fff", fontWeight: 950 },
  emptyCta: { minHeight: 46, display: "inline-flex", alignItems: "center", borderRadius: 10, background: theme.gradient, color: "#fff", padding: "0 16px", textDecoration: "none", fontWeight: 950 },
};
