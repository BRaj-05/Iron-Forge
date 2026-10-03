"use client";

import { useMemo, useState } from "react";
import { Check, Droplets, Flame, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { Select } from "@/components/ui/FormField";
import { nutritionPlans } from "@/lib/cardio-nutrition-data";
import { NUTRITION_IMAGE_URLS } from "@/lib/media";
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
  const dayScore = Math.round(((completed / 4) * 70) + (Math.min(water, 8) / 8) * 30);

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
    <div className="nutrition-command-page">
      <section className="nutrition-command-hero">
        <p className="if-kicker">DIET COMPASS</p>
        <h1>Eat with a plan, then mark the day honestly.</h1>
        <p className="nutrition-hero-copy">
          Choose a goal template, track meals, and keep hydration visible. These
          plans are educational, so medical conditions should still be reviewed
          with a doctor or registered dietitian.
        </p>
      </section>

      <section className="nutrition-control-grid">
        <div className="nutrition-plan-control">
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

        <article className="nutrition-mini-card">
          <span className="nutrition-mini-icon"><Droplets size={17} /></span>
          <div>
            <small>Hydration</small>
            <strong>{water}/8</strong>
          </div>
          <div className="nutrition-water-controls">
            <Button variant="secondary" onClick={() => updateWater(water - 1)}>-</Button>
            <Button variant="secondary" onClick={() => updateWater(water + 1)}>+</Button>
          </div>
        </article>

        <article className="nutrition-mini-card">
          <span className="nutrition-mini-icon"><Check size={17} /></span>
          <div>
            <small>Meals checked</small>
            <strong>{completed}/4</strong>
          </div>
          <em>{completed < 3 ? "Keep the day moving." : "Strong consistency."}</em>
        </article>

        <article className="nutrition-score-card">
          <span><Flame size={16} /> Daily score</span>
          <strong>{dayScore}%</strong>
          <div className="nutrition-score-track"><span style={{ width: dayScore + "%" }} /></div>
        </article>

        <Button onClick={saveDietHistory} className="nutrition-save-button">
          Save today
        </Button>
      </section>

      {status && <div className="nutrition-message">{status}</div>}

      {selectedPlan && (
        <section className="nutrition-plan-shell">
          <div
            className="nutrition-plan-photo"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(10,10,15,0.04), rgba(10,10,15,0.78)), url(${NUTRITION_IMAGE_URLS[selectedPlan.slug] || NUTRITION_IMAGE_URLS["maintenance-habit-plan"]})`,
            }}
          >
            <span className="nutrition-photo-tag">{selectedPlan.goal}</span>
            <h2>{selectedPlan.name}</h2>
          </div>
          <div className="nutrition-meal-timeline">
            <div className="nutrition-meal-timeline-head">
              <div>
                <p className="if-kicker">Today&apos;s meals</p>
                <h2>Eat through the day with structure.</h2>
              </div>
              <span><Sparkles size={15} /> {completed}/4 complete</span>
            </div>

            {(Object.keys(selectedPlan.meals) as MealKey[]).map((key, index) => (
              <article
                key={key}
                className={"nutrition-meal-row " + (meals[key] ? "is-done" : "")}
              >
                <div className="nutrition-meal-step">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i />
                </div>
                <div className="nutrition-meal-copy">
                  <p className="nutrition-meal-label">{mealLabels[key]}</p>
                  <h3>{selectedPlan.meals[key]}</h3>
                </div>
                <Button
                  variant={meals[key] ? "success" : "secondary"}
                  onClick={() => toggleMeal(key)}
                  className="nutrition-mark-button"
                >
                  {meals[key] ? "Done" : "Mark"}
                </Button>
              </article>
            ))}
          </div>
        </section>
      )}

      {selectedPlan && (
        <section className="nutrition-plan-notes">
          <div>
            <p className="if-kicker">PLAN DETAILS</p>
            <h2>{selectedPlan.goal}</h2>
            <p>{selectedPlan.dietType} · {selectedPlan.caloriesRange} · {selectedPlan.proteinTarget}</p>
          </div>
          <div className="nutrition-note-grid">
            {selectedPlan.notes.map((note) => <span key={note}>{note}</span>)}
            {selectedPlan.warnings.map((warning) => <span key={warning}>{warning}</span>)}
          </div>
        </section>
      )}
    </div>
  );
}

/* legacy styles removed */
