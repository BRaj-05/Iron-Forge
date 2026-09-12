import Link from "next/link";
import type { CSSProperties } from "react";
import { yogaAsanas, yogaCategories, yogaImageForSlot } from "@/lib/yoga-data";
import { theme } from "@/lib/theme";

export default function CustomerYogaPage() {
  const flow = yogaAsanas.slice(0, 6);

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>YOGA RECOVERY</p>
        <h1 style={styles.title}>Mobility that feels like recovery, not homework.</h1>
        <p style={styles.copy}>
          Use yoga to cool down, manage stiffness, improve posture awareness,
          and build a quieter finish to heavy training days.
        </p>
      </section>

      <section style={styles.categoryGrid}>
        {yogaCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/yoga/${category.slug}`}
            style={{
              ...styles.category,
              backgroundImage: `linear-gradient(180deg, rgba(10,10,15,0.25), rgba(10,10,15,0.88)), url(${yogaImageForSlot(category.imageSlot)})`,
            }}
          >
            <span>{category.name}</span>
            <small>{category.focus}</small>
          </Link>
        ))}
      </section>

      <section style={styles.flowPanel}>
        <div>
          <p style={styles.eyebrow}>15-MINUTE RESET</p>
          <h2 style={styles.sectionTitle}>A simple sequence for after workouts.</h2>
        </div>
        <div style={styles.flowGrid}>
          {flow.map((asana, index) => (
            <article key={asana.slug} style={styles.asanaCard}>
              <span style={styles.step}>{index + 1}</span>
              <h3>{asana.name}</h3>
              <p>{asana.duration}</p>
              <Link href={`/yoga/asana/${asana.slug}`} style={styles.link}>
                Open guide
              </Link>
            </article>
          ))}
        </div>
        <p style={styles.safeNote}>
          Wellness note: if you have dizziness, severe pain, pregnancy, heart
          disease, high blood pressure, or a diagnosed condition, use these
          guides only after advice from a qualified professional.
        </p>
      </section>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { padding: 32 },
  hero: {
    borderRadius: 28,
    border: `1px solid ${theme.border}`,
    padding: 34,
    marginBottom: 22,
    background:
      "radial-gradient(circle at 86% 16%, rgba(34,197,94,0.2), transparent 30%), linear-gradient(135deg,#10131a,#08080d)",
  },
  eyebrow: { color: theme.green, fontSize: 10, letterSpacing: 4, fontWeight: 950 },
  title: { fontSize: "clamp(42px, 6vw, 82px)", lineHeight: 0.95, maxWidth: 920, margin: "12px 0" },
  copy: { color: theme.textSecondary, lineHeight: 1.75, maxWidth: 760 },
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
    marginBottom: 22,
  },
  category: {
    minHeight: 230,
    borderRadius: 22,
    backgroundSize: "cover",
    backgroundPosition: "center",
    border: `1px solid ${theme.border}`,
    color: "#fff",
    textDecoration: "none",
    padding: 20,
    display: "grid",
    alignContent: "end",
    gap: 10,
  },
  flowPanel: {
    borderRadius: 26,
    border: `1px solid ${theme.border}`,
    padding: 26,
    background: theme.surface,
  },
  sectionTitle: { fontSize: 42, lineHeight: 1, margin: "10px 0 20px" },
  flowGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 },
  asanaCard: {
    borderRadius: 18,
    border: `1px solid ${theme.border}`,
    background: theme.surfaceAlt,
    padding: 18,
  },
  step: { color: theme.green, fontWeight: 950 },
  link: { color: theme.gold, fontWeight: 900, textDecoration: "none" },
  safeNote: { color: theme.textSecondary, lineHeight: 1.7, marginTop: 20 },
};
