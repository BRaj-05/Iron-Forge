import Link from "next/link";
import type { CSSProperties } from "react";
import { exercises, muscleGroups } from "@/lib/exercise-data";
import { cardioWorkouts, learningImageForSlot } from "@/lib/cardio-nutrition-data";
import { theme } from "@/lib/theme";

const todayStack = [
  exercises.find((exercise) => exercise.slug === "bench-press"),
  exercises.find((exercise) => exercise.slug === "lat-pulldown"),
  exercises.find((exercise) => exercise.slug === "goblet-squat"),
  exercises.find((exercise) => exercise.slug === "plank"),
].filter(Boolean);

export default function CustomerWorkoutsPage() {
  const cardio = cardioWorkouts.slice(0, 3);

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <p style={styles.eyebrow}>WORKOUT COMMAND</p>
          <h1 style={styles.title}>A training day that already knows the next move.</h1>
          <p style={styles.copy}>
            Start with a balanced strength stack, add one low-impact cardio block,
            and keep every movement tied to XP instead of random exercise hopping.
          </p>
          <div style={styles.heroActions}>
            <Link href="/customer/todos" style={styles.primaryButton}>
              Open Mission Tasks
            </Link>
            <Link href="/gym" style={styles.secondaryButton}>
              Explore Exercise Library
            </Link>
          </div>
        </div>
        <div style={styles.focusCard}>
          <span style={styles.focusLabel}>Today&apos;s Load</span>
          <strong>4 strength moves</strong>
          <span>+ 25 min cardio</span>
          <span>+ stretch finish</span>
        </div>
      </section>

      <section style={styles.grid}>
        {todayStack.map((exercise, index) => (
          <article key={exercise!.slug} style={styles.card}>
            <span style={styles.number}>0{index + 1}</span>
            <p style={styles.cardMeta}>{exercise!.muscleGroup}</p>
            <h2 style={styles.cardTitle}>{exercise!.name}</h2>
            <p style={styles.cardCopy}>{exercise!.mainBenefit}</p>
            <div style={styles.chips}>
              <span>{exercise!.setsReps.beginner}</span>
              <span>{exercise!.difficulty}</span>
            </div>
            <Link href={`/exercise/${exercise!.slug}`} style={styles.cardLink}>
              Learn form
            </Link>
          </article>
        ))}
      </section>

      <section style={styles.split}>
        <div style={styles.panel}>
          <p style={styles.eyebrow}>MUSCLE MAP</p>
          <h2 style={styles.sectionTitle}>Pick the body part, then train with context.</h2>
          <div style={styles.groupList}>
            {muscleGroups.slice(0, 8).map((group) => (
              <Link key={group.slug} href={`/gym/${group.slug}`} style={styles.groupRow}>
                <span>{group.name}</span>
                <small>{group.focus}</small>
              </Link>
            ))}
          </div>
        </div>

        <div style={styles.panel}>
          <p style={styles.eyebrow}>CARDIO FINISHERS</p>
          <h2 style={styles.sectionTitle}>Use cardio for a purpose, not punishment.</h2>
          <div style={styles.cardioGrid}>
            {cardio.map((item) => (
              <article
                key={item.slug}
                style={{
                  ...styles.cardioCard,
                  backgroundImage: `linear-gradient(180deg, rgba(10,10,15,0.2), rgba(10,10,15,0.92)), url(${learningImageForSlot(item.imageSlot)})`,
                }}
              >
                <span>{item.intensity}</span>
                <strong>{item.name}</strong>
                <small>{item.duration}</small>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { padding: 32 },
  hero: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 320px",
    gap: 24,
    alignItems: "center",
    border: `1px solid ${theme.border}`,
    borderRadius: 28,
    padding: 34,
    marginBottom: 22,
    background:
      "radial-gradient(circle at 82% 20%, rgba(249,115,22,0.26), transparent 30%), linear-gradient(135deg,#111118,#09090d)",
  },
  eyebrow: {
    color: theme.accent,
    fontSize: 10,
    letterSpacing: 4,
    fontWeight: 950,
  },
  title: {
    fontSize: "clamp(42px, 6vw, 82px)",
    lineHeight: 0.95,
    maxWidth: 900,
    margin: "12px 0",
  },
  copy: { color: theme.textSecondary, lineHeight: 1.75, maxWidth: 760 },
  heroActions: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 },
  primaryButton: {
    background: theme.gradient,
    color: "#fff",
    borderRadius: 14,
    padding: "14px 18px",
    textDecoration: "none",
    fontWeight: 950,
  },
  secondaryButton: {
    border: `1px solid ${theme.border}`,
    color: theme.textPrimary,
    borderRadius: 14,
    padding: "14px 18px",
    textDecoration: "none",
    fontWeight: 950,
  },
  focusCard: {
    minHeight: 220,
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.055)",
    display: "grid",
    alignContent: "center",
    gap: 14,
    padding: 24,
    boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
  },
  focusLabel: { color: theme.gold, fontSize: 12, textTransform: "uppercase" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
    marginBottom: 22,
  },
  card: {
    border: `1px solid ${theme.border}`,
    borderRadius: 22,
    padding: 22,
    background: "linear-gradient(145deg, rgba(17,24,39,0.88), rgba(17,17,24,0.95))",
  },
  number: { color: theme.accent, fontWeight: 950 },
  cardMeta: { color: theme.textMuted, fontSize: 12, textTransform: "uppercase" },
  cardTitle: { fontSize: 28, margin: "8px 0" },
  cardCopy: { color: theme.textSecondary, lineHeight: 1.6, minHeight: 52 },
  chips: { display: "flex", flexWrap: "wrap", gap: 8, margin: "16px 0" },
  cardLink: { color: theme.gold, fontWeight: 900, textDecoration: "none" },
  split: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  panel: {
    border: `1px solid ${theme.border}`,
    borderRadius: 24,
    padding: 24,
    background: theme.surface,
  },
  sectionTitle: { fontSize: 38, lineHeight: 1, margin: "10px 0 18px" },
  groupList: { display: "grid", gap: 10 },
  groupRow: {
    display: "grid",
    gap: 4,
    padding: 14,
    borderRadius: 16,
    background: theme.surfaceAlt,
    color: theme.textPrimary,
    textDecoration: "none",
  },
  cardioGrid: { display: "grid", gap: 12 },
  cardioCard: {
    minHeight: 142,
    borderRadius: 18,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: 18,
    display: "grid",
    alignContent: "end",
    gap: 5,
    border: `1px solid ${theme.border}`,
  },
};
