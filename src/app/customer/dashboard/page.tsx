"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { motion } from "framer-motion";
import { theme } from "@/lib/theme";

interface Progress {
  xp: number;
  level: number;
  streak: number;
  badges?: string[];
}

interface AttendanceRecord {
  checkInTime: string;
}

type MealKey = "morning" | "afternoon" | "dinner";

type MealPlan = {
  key: MealKey;
  label: string;
  time: string;
  diabetic: string;
  fatLoss: string;
  muscle: string;
};

const defaultProgress: Progress = {
  xp: 0,
  level: 1,
  streak: 0,
  badges: [],
};

const mealPlans: MealPlan[] = [
  {
    key: "morning",
    label: "Morning",
    time: "7:00 - 9:00 AM",
    diabetic:
      "Oats or dalia, eggs/paneer/tofu, nuts, unsweetened tea. Avoid juice and sugary cereal.",
    fatLoss:
      "High-protein breakfast: eggs/tofu/paneer, fruit, oats or sprouts. Keep oil low.",
    muscle:
      "Oats + milk/curd, eggs/paneer/tofu, banana, peanut butter in measured amount.",
  },
  {
    key: "afternoon",
    label: "Afternoon",
    time: "12:30 - 2:30 PM",
    diabetic:
      "Roti or brown rice in controlled portion, dal/lean protein, salad, curd. Avoid sweet drinks.",
    fatLoss:
      "Lean protein, big salad, dal/beans, one measured carb serving. Stop before heavy fullness.",
    muscle:
      "Rice/roti, dal/chicken/paneer/tofu, vegetables, curd. Add carbs around training.",
  },
  {
    key: "dinner",
    label: "Dinner",
    time: "7:00 - 9:00 PM",
    diabetic:
      "Light dinner: vegetables, protein, dal/soup. Keep carbs smaller than lunch if glucose spikes.",
    fatLoss:
      "Protein + vegetables + soup/salad. Avoid late fried snacks and desserts.",
    muscle:
      "Protein-heavy dinner with vegetables and moderate carbs if training was late.",
  },
];

function mealStorageKey() {
  return `iron-forge-meals-${format(new Date(), "yyyy-MM-dd")}`;
}

export default function CustomerDashboard() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [meals, setMeals] = useState<Record<MealKey, boolean>>({
    morning: false,
    afternoon: false,
    dinner: false,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchDashboard() {
    try {
      const [progressRes, attendanceRes] = await Promise.all([
        fetch("/api/progress", { cache: "no-store" }),
        fetch("/api/attendance/history", { cache: "no-store" }),
      ]);

      if (progressRes.ok) {
        setProgress(await progressRes.json());
      } else {
        setProgress(defaultProgress);
      }

      if (attendanceRes.ok) {
        setAttendance(await attendanceRes.json());
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
    const savedMeals = window.localStorage.getItem(mealStorageKey());
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(mealStorageKey(), JSON.stringify(meals));
  }, [meals]);

  const current = progress || defaultProgress;
  const progressPercent = current.xp % 100;
  const completedMeals = Object.values(meals).filter(Boolean).length;
  const dailyScore = Math.min(
    100,
    attendance.length > 0 ? 40 + completedMeals * 15 + Math.min(current.streak, 10) * 2 : completedMeals * 15,
  );

  const completedDays = useMemo(
    () =>
      new Set(
        attendance.map((entry) =>
          format(new Date(entry.checkInTime), "yyyy-MM-dd"),
        ),
      ),
    [attendance],
  );

  async function handleCheckIn() {
    setMessage("");

    const res = await fetch("/api/attendance/checkin", { method: "POST" });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Check-in failed");
      return;
    }

    setMessage("Check-in successful. +10 XP added.");
    setProgress({ xp: data.xp, level: data.level, streak: data.streak });
    await fetchDashboard();
  }

  function toggleMeal(key: MealKey) {
    setMeals((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  if (loading) {
    return (
      <div style={{ padding: 32 }}>
        <div style={styles.loading}>Loading your training cockpit...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        style={styles.hero}
      >
        <div>
          <p style={styles.eyebrow}>TODAY</p>
          <h1 style={styles.heroTitle}>What are we doing today?</h1>
          <p style={styles.heroCopy}>
            Check in, choose one clear workout, and keep meals honest. No noisy
            dashboard drama, just the next few actions that move the week forward.
          </p>
          <div style={styles.heroActions}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCheckIn}
              style={styles.primaryButton}
            >
              I&apos;m at the gym
            </motion.button>
            <a href="/customer/todos" style={styles.secondaryButton}>
              See today&apos;s tasks
            </a>
          </div>
        </div>

        <div style={styles.scoreOrb}>
          <span style={styles.scoreNumber}>{dailyScore}</span>
          <span style={styles.scoreLabel}>Today&apos;s score</span>
        </div>
      </motion.section>

      {message && <div style={styles.message}>{message}</div>}

      <section style={styles.statsGrid}>
        <Stat label="XP earned" value={current.xp} accent={theme.gold} />
        <Stat label="Level" value={current.level} accent={theme.accent} />
        <Stat label="Streak" value={`${current.streak}d`} accent={theme.green} />
        <Stat label="Meals checked" value={`${completedMeals}/3`} accent="#38BDF8" />
      </section>

      <section style={styles.mainGrid}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={styles.panel}
        >
          <div style={styles.panelHeader}>
            <div>
              <p style={styles.eyebrow}>CHECK-INS</p>
              <h2 style={styles.panelTitle}>Last 30 days</h2>
            </div>
            <div style={styles.xpBarWrap}>
              <span>{progressPercent}/100 XP to level {current.level + 1}</span>
              <div style={styles.xpTrack}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.7 }}
                  style={styles.xpFill}
                />
              </div>
            </div>
          </div>

          <div style={styles.heatmap}>
            {Array.from({ length: 30 }).map((_, index) => {
              const day = subDays(new Date(), 29 - index);
              const key = format(day, "yyyy-MM-dd");
              const attended = completedDays.has(key);

              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.14 }}
                  title={format(day, "MMM d")}
                  style={{
                    ...styles.heatCell,
                    background: attended ? theme.green : "rgba(255,255,255,0.08)",
                    boxShadow: attended
                      ? "0 0 18px rgba(34,197,94,0.32)"
                      : "none",
                  }}
                />
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={styles.coachPanel}
        >
          <p style={styles.eyebrow}>COACH NOTE</p>
          <h2 style={styles.panelTitle}>Today&apos;s focus</h2>
          <p style={styles.coachText}>
            Start with the movement you are most likely to skip. Then finish
            with 20 minutes of easy cardio and a protein-forward dinner. Simple
            beats heroic when you need to repeat it tomorrow.
          </p>
          <div style={styles.coachChips}>
            <span>Fat loss</span>
            <span>Diabetes-aware meals</span>
            <span>No skipped dinner</span>
          </div>
        </motion.div>
      </section>

      <section style={styles.commandGrid}>
        {[
          { label: "Plan a workout", href: "/customer/workouts", accent: theme.accent },
          { label: "Stretch or recover", href: "/customer/yoga", accent: theme.green },
          { label: "Check meals", href: "/customer/diet", accent: theme.gold },
          { label: "See progress", href: "/customer/progress", accent: "#38BDF8" },
          { label: "Book a trainer", href: "/customer/sessions", accent: theme.silver },
          { label: "Payments", href: "/customer/payments", accent: theme.gold },
          { label: "Ask coach", href: "/customer/ai-coach", accent: theme.green },
        ].map((item) => (
          <motion.a
            key={item.href}
            href={item.href}
            whileHover={{ y: -4 }}
            style={{
              ...styles.commandCard,
              borderTopColor: item.accent,
            }}
          >
            <span>{item.label}</span>
            <strong>Go</strong>
          </motion.a>
        ))}
      </section>

      <section style={styles.mealSection}>
        <div style={styles.sectionHeader}>
          <p style={styles.eyebrow}>MEALS</p>
          <h2 style={styles.sectionTitle}>Keep the basics visible.</h2>
          <p style={styles.sectionCopy}>
            This is a simple meal check for now: morning, afternoon, dinner.
            It is not meant to be perfect, just honest enough to notice patterns.
          </p>
        </div>

        <div style={styles.mealGrid}>
          {mealPlans.map((meal, index) => (
            <motion.article
              key={meal.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              style={{
                ...styles.mealCard,
                borderColor: meals[meal.key] ? `${theme.green}80` : theme.border,
              }}
            >
              <div style={styles.mealTop}>
                <div>
                  <span style={styles.mealTime}>{meal.time}</span>
                  <h3 style={styles.mealTitle}>{meal.label}</h3>
                </div>
                <button
                  onClick={() => toggleMeal(meal.key)}
                  style={{
                    ...styles.mealToggle,
                    background: meals[meal.key] ? theme.green : "transparent",
                    color: meals[meal.key] ? "#03140a" : theme.textSecondary,
                  }}
                >
                  {meals[meal.key] ? "Done" : "Mark"}
                </button>
              </div>
              <MealAdvice title="Fat loss" text={meal.fatLoss} />
              <MealAdvice title="Diabetes aware" text={meal.diabetic} />
              <MealAdvice title="Muscle gain" text={meal.muscle} />
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <motion.div whileHover={{ y: -3 }} style={{ ...styles.stat, borderLeftColor: accent }}>
      <span>{label}</span>
      <strong style={{ color: accent }}>{value}</strong>
    </motion.div>
  );
}

function MealAdvice({ title, text }: { title: string; text: string }) {
  return (
    <div style={styles.mealAdvice}>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    padding: "clamp(18px, 3vw, 32px)",
  },
  loading: {
    padding: 24,
    borderRadius: 16,
    border: `1px solid ${theme.border}`,
    background: theme.surface,
    color: theme.textSecondary,
  },
  hero: {
    minHeight: 330,
    borderRadius: 24,
    padding: "clamp(22px, 4vw, 38px)",
    marginBottom: 20,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 300px",
    gap: 24,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 82% 18%, rgba(249,115,22,0.2), transparent 28%), linear-gradient(135deg,#111118,#150d08)",
    border: `1px solid ${theme.border}`,
  },
  eyebrow: {
    color: theme.accent,
    fontFamily: "'Space Mono', monospace",
    fontSize: 11,
    letterSpacing: 2.4,
    fontWeight: 900,
  },
  heroTitle: {
    fontSize: "clamp(38px, 5.8vw, 76px)",
    lineHeight: 0.98,
    margin: "12px 0",
    maxWidth: 820,
  },
  heroCopy: {
    color: theme.textSecondary,
    lineHeight: 1.7,
    maxWidth: 720,
  },
  heroActions: {
    display: "flex",
    gap: 12,
    marginTop: 24,
    flexWrap: "wrap",
  },
  primaryButton: {
    border: "none",
    borderRadius: 14,
    background: theme.gradientGreen,
    color: "#fff",
    cursor: "pointer",
    fontWeight: 900,
    padding: "14px 20px",
  },
  secondaryButton: {
    border: `1px solid ${theme.border}`,
    borderRadius: 14,
    color: theme.textPrimary,
    textDecoration: "none",
    fontWeight: 900,
    padding: "14px 20px",
  },
  scoreOrb: {
    width: 220,
    height: 220,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    alignContent: "center",
    justifySelf: "center",
    background:
      "conic-gradient(#22C55E 0 74%, #FBBF24 74% 88%, rgba(255,255,255,0.12) 88% 100%)",
    boxShadow: "0 0 60px rgba(34,197,94,0.22)",
  },
  scoreNumber: {
    fontSize: 62,
    fontWeight: 950,
  },
  scoreLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  message: {
    borderRadius: 14,
    border: `1px solid ${theme.accent}`,
    color: theme.accent,
    background: `${theme.accent}12`,
    padding: 13,
    marginBottom: 18,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 14,
    marginBottom: 18,
  },
  stat: {
    padding: 20,
    borderRadius: 16,
    border: `1px solid ${theme.border}`,
    borderLeft: "4px solid",
    background: "rgba(17,24,39,0.74)",
    display: "grid",
    gap: 10,
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.15fr) minmax(300px, .85fr)",
    gap: 18,
    marginBottom: 22,
  },
  panel: {
    borderRadius: 20,
    border: `1px solid ${theme.border}`,
    background: theme.surface,
    padding: 24,
  },
  coachPanel: {
    borderRadius: 20,
    border: `1px solid ${theme.gold}40`,
    background: "linear-gradient(145deg,#111118,#15120a)",
    padding: 24,
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    marginBottom: 20,
  },
  panelTitle: {
    fontSize: 26,
    margin: "8px 0 0",
  },
  xpBarWrap: {
    minWidth: 220,
    color: theme.textSecondary,
    fontSize: 12,
  },
  xpTrack: {
    height: 8,
    borderRadius: 99,
    background: theme.border,
    overflow: "hidden",
    marginTop: 8,
  },
  xpFill: {
    height: "100%",
    background: theme.gradient,
  },
  heatmap: {
    display: "grid",
    gridTemplateColumns: "repeat(10, 1fr)",
    gap: 8,
  },
  heatCell: {
    aspectRatio: "1 / 1",
    borderRadius: 8,
  },
  coachText: {
    color: theme.textSecondary,
    lineHeight: 1.7,
  },
  coachChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 18,
  },
  mealSection: {
    borderRadius: 22,
    border: `1px solid ${theme.border}`,
    background: "rgba(17,17,24,0.78)",
    padding: 26,
  },
  commandGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 14,
    marginBottom: 22,
  },
  commandCard: {
    border: `1px solid ${theme.border}`,
    borderTop: "4px solid",
    borderRadius: 18,
    background: "rgba(17,24,39,0.72)",
    color: theme.textPrimary,
    textDecoration: "none",
    padding: 18,
    display: "grid",
    gap: 8,
  },
  sectionHeader: {
    maxWidth: 800,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: "clamp(30px, 4vw, 50px)",
    lineHeight: 1.04,
    margin: "10px 0",
  },
  sectionCopy: {
    color: theme.textSecondary,
    lineHeight: 1.7,
  },
  mealGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
  },
  mealCard: {
    borderRadius: 18,
    border: `1px solid ${theme.border}`,
    background: theme.surfaceAlt,
    padding: 18,
  },
  mealTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 14,
  },
  mealTime: {
    color: theme.textMuted,
    fontSize: 12,
  },
  mealTitle: {
    margin: "4px 0 0",
    fontSize: 24,
  },
  mealToggle: {
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 900,
    padding: "9px 12px",
    alignSelf: "flex-start",
  },
  mealAdvice: {
    borderTop: `1px solid ${theme.border}`,
    paddingTop: 12,
    marginTop: 12,
    color: theme.textSecondary,
    lineHeight: 1.55,
  },
};
