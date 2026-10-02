"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Select } from "@/components/ui/FormField";
import { nutritionPlans } from "@/lib/cardio-nutrition-data";
import { NUTRITION_IMAGE_URLS } from "@/lib/media";
import { theme } from "@/lib/theme";
import { apiRoutes } from "@/config/api-routes";

type MealKey = "breakfast" | "lunch" | "snack" | "dinner";

const mealLabels: Record<MealKey, string> = {
  breakfast: "Morning",
  lunch: "Afternoon",
  snack: "Evening Snack",
  dinner: "Dinner",
};

const initialMeals = (): Record<MealKey, boolean> => {
  if (typeof window === "undefined") {
    return { breakfast: false, lunch: false, snack: false, dinner: false };
  }

  const saved = window.localStorage.getItem("iron-forge-diet-checks");
  return saved
    ? JSON.parse(saved)
    : { breakfast: false, lunch: false, snack: false, dinner: false };
};

export default function CustomerDietPage() {
  const [selectedSlug, setSelectedSlug] = useState(nutritionPlans[0]?.slug || "");
  const [meals, setMeals] = useState(initialMeals);
  const [water, setWater] = useState(() => {
    if (typeof window === "undefined") return 4;
    return Number(window.localStorage.getItem("iron-forge-water") || 4);
  });
  const [status, setStatus] = useState("");

  const selectedPlan = useMemo(
    () => nutritionPlans.find((plan) => plan.slug === selectedSlug) || nutritionPlans[0],
    [selectedSlug],
  );

  function toggleMeal(key: MealKey) {
    const next = { ...meals, [key]: !meals[key] };
    setMeals(next);
    window.localStorage.setItem("iron-forge-diet-checks", JSON.stringify(next));
  }

  function updateWater(nextWater: number) {
    const clamped = Math.max(0, Math.min(12, nextWater));
    setWater(clamped);
    window.localStorage.setItem("iron-forge-water", String(clamped));
  }

  const completed = Object.values(meals).filter(Boolean).length;

  async function saveDietHistory() {
    if (!selectedPlan) return;
    setStatus("");
    const response = await fetch(apiRoutes.customer.dietLog, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meals: (Object.keys(selectedPlan.meals) as MealKey[]).map((key) => ({
          name: mealLabels[key],
          food: selectedPlan.meals[key],
          done: meals[key],
        })),
        waterCups: water,
        completed: completed >= 3,
        notes: `${selectedPlan.name} saved from diet page.`,
      }),
    });
    const payload = await response.json();
    setStatus(response.ok ? "Diet history saved for today." : payload.error || "Could not save diet.");
  }

  return (
    <div style={styles.page}>
      <Card style={styles.hero}>
        <p style={styles.eyebrow}>DIET COMPASS</p>
        <h1 style={styles.title}>Eat with a plan, then mark the day honestly.</h1>
        <p style={styles.copy}>
          Choose a goal template, track meals, and keep hydration visible. These
          plans are educational, so medical conditions should still be reviewed
          with a doctor or registered dietitian.
        </p>
      </Card>

      <section style={styles.controls}>
        <div>
          <Select
            label="Active plan"
            value={selectedSlug}
            onChange={(event) => setSelectedSlug(event.target.value)}
          >
            {nutritionPlans.map((plan) => (
              <option key={plan.slug} value={plan.slug}>
                {plan.name}
              </option>
            ))}
          </Select>
        </div>
        <Card style={styles.waterCard}>
          <span>Water</span>
          <strong>{water}/8 glasses</strong>
          <div>
            <Button variant="secondary" onClick={() => updateWater(water - 1)} style={styles.smallButton}>-</Button>
            <Button variant="secondary" onClick={() => updateWater(water + 1)} style={styles.smallButton}>+</Button>
          </div>
        </Card>
        <Card style={styles.waterCard}>
          <span>Meals Checked</span>
          <strong>{completed}/4</strong>
          <small>{completed < 3 ? "Do not let the day get away from you." : "Nice, the basics are protected."}</small>
        </Card>
        <Button onClick={saveDietHistory} style={styles.saveButton}>Save diet history</Button>
      </section>

      {status && <Card accent={theme.green} style={styles.message}>{status}</Card>}

      {selectedPlan && (
        <section style={styles.planShell}>
          <div
            style={{
              ...styles.planPhoto,
              backgroundImage: `linear-gradient(180deg, rgba(10,10,15,0.04), rgba(10,10,15,0.78)), url(${NUTRITION_IMAGE_URLS[selectedPlan.slug] || NUTRITION_IMAGE_URLS["maintenance-habit-plan"]})`,
            }}
          >
            <span style={styles.photoTag}>{selectedPlan.goal}</span>
            <h2>{selectedPlan.name}</h2>
          </div>
          <div style={styles.planGrid}>
            {(Object.keys(selectedPlan.meals) as MealKey[]).map((key) => (
              <Card
                key={key}
                accent={meals[key] ? theme.green : undefined}
                style={{
                  ...styles.mealCard,
                  borderColor: meals[key] ? `${theme.green}88` : theme.border,
                }}
              >
                <div>
                  <p style={styles.mealLabel}>{mealLabels[key]}</p>
                  <h2>{selectedPlan.meals[key]}</h2>
                </div>
                <Button
                  variant={meals[key] ? "success" : "secondary"}
                  onClick={() => toggleMeal(key)}
                  style={{
                    ...styles.markButton,
                    color: meals[key] ? "#03140a" : theme.textPrimary,
                  }}
                >
                  {meals[key] ? "Done" : "Mark"}
                </Button>
              </Card>
            ))}
          </div>
        </section>
      )}

      {selectedPlan && (
        <section style={styles.notes}>
          <div>
            <p style={styles.eyebrow}>PLAN DETAILS</p>
            <h2 style={styles.sectionTitle}>{selectedPlan.goal}</h2>
            <p>{selectedPlan.dietType} · {selectedPlan.caloriesRange} · {selectedPlan.proteinTarget}</p>
          </div>
          <div style={styles.noteGrid}>
            {selectedPlan.notes.map((note) => <span key={note}>{note}</span>)}
            {selectedPlan.warnings.map((warning) => <span key={warning}>{warning}</span>)}
          </div>
        </section>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { padding: 32 },
  hero: {
    padding: 34,
    marginBottom: 22,
    background:
      "radial-gradient(circle at 85% 16%, rgba(251,191,36,0.22), transparent 30%), linear-gradient(135deg,#111118,#120f07)",
  },
  eyebrow: { color: theme.gold, fontSize: 10, letterSpacing: 4, fontWeight: 950 },
  title: { fontSize: "clamp(34px, 5vw, 66px)", lineHeight: 1, maxWidth: 940, margin: "12px 0" },
  copy: { color: theme.textSecondary, lineHeight: 1.75, maxWidth: 820 },
  controls: { display: "grid", gridTemplateColumns: "1.3fr .75fr .75fr auto", gap: 14, marginBottom: 18, alignItems: "stretch" },
  waterCard: {
    padding: 18,
    display: "grid",
    gap: 8,
  },
  smallButton: {
    width: 38,
    minHeight: 34,
    height: 34,
    padding: 0,
    marginRight: 8,
  },
  saveButton: { alignSelf: "end" },
  message: { background: `${theme.green}12`, color: theme.green, padding: 13, marginBottom: 18 },
  planShell: { display: "grid", gridTemplateColumns: "minmax(280px, 0.65fr) minmax(0, 1fr)", gap: 18, alignItems: "stretch" },
  planPhoto: { minHeight: 520, borderRadius: 14, border: `1px solid ${theme.border}`, backgroundSize: "cover", backgroundPosition: "center", padding: 24, display: "grid", alignContent: "end", overflow: "hidden" },
  photoTag: { color: theme.gold, textTransform: "uppercase", letterSpacing: 3, fontWeight: 950, fontSize: 11 },
  planGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(220px, 1fr))", gap: 14 },
  mealCard: { padding: 18, minHeight: 150, display: "grid", gridTemplateColumns: "1fr auto", gap: 14, alignItems: "start", transition: "transform 0.22s ease, border-color 0.22s ease" },
  mealLabel: { color: theme.textMuted, textTransform: "uppercase", fontSize: 12 },
  markButton: { minHeight: 38, alignSelf: "flex-start" },
  notes: { marginTop: 18, border: `1px solid ${theme.border}`, borderRadius: 12, background: theme.surfaceAlt, padding: 24 },
  sectionTitle: { fontSize: 36, margin: "8px 0" },
  noteGrid: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 },
};
