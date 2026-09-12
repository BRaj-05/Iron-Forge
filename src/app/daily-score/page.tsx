"use client";

import { motion } from "framer-motion";
import PublicPageShell from "@/components/home/PublicPageShell";
import MemberAction from "@/components/home/MemberAction";
import { scoreBreakdown } from "@/lib/public-content";

const mealChecks = [
  { label: "Breakfast", status: "Protein first", tone: "#22C55E" },
  { label: "Lunch", status: "Balanced plate", tone: "#FBBF24" },
  { label: "Dinner", status: "Do not skip", tone: "#F97316" },
  { label: "Water", status: "2.7L target", tone: "#38BDF8" },
];

export default function DailyScorePage() {
  const total = scoreBreakdown.reduce((sum, item) => sum + item.value, 0);

  return (
    <PublicPageShell>
      <section className="if-section if-hero">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p className="if-kicker">Daily Score</p>
          <h1 className="if-title">One number for the day you are building.</h1>
          <p className="if-copy">
            Daily Score combines check-ins, completed missions, streaks,
            recovery, meals, and hydration into one simple member-facing
            progress signal.
          </p>
          <div className="if-actions">
            <MemberAction
              href="/customer/dashboard"
              label="Open My Daily Score"
              lockedLabel="Login to track score"
            />
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="if-card if-float"
        >
          <span className="if-tag">Today</span>
          <div className="if-score-orb">
            <strong>{total}</strong>
            <span>out of 100</span>
          </div>
        </motion.aside>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid-lg">
          <article className="if-card">
            <span className="if-tag">Score Breakdown</span>
            <div style={{ display: "grid", gap: 12 }}>
              {scoreBreakdown.map((item) => (
                <div key={item.label} className="if-row" style={{ gridTemplateColumns: "1fr auto" }}>
                  <span>{item.label}</span>
                  <strong style={{ color: item.color }}>+{item.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="if-card">
            <span className="if-tag">Meal Checkpoints</span>
            <h2>Do not let skipped meals become invisible.</h2>
            <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
              {mealChecks.map((meal) => (
                <div key={meal.label} className="if-row" style={{ gridTemplateColumns: "1fr auto" }}>
                  <span>{meal.label}</span>
                  <strong style={{ color: meal.tone }}>{meal.status}</strong>
                </div>
              ))}
            </div>
            <p className="if-muted" style={{ marginTop: 18 }}>
              Nutrition guidance is general education. Medical conditions need
              a doctor or qualified dietitian.
            </p>
          </article>
        </div>
      </section>
    </PublicPageShell>
  );
}
