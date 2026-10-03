"use client";

import { useMemo, useState } from "react";
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
        <article className="nutrition-mini-card">
          <span>Water</span>
          <strong>{water}/8 glasses</strong>
          <div className="nutrition-water-controls">
            <Button variant="secondary" onClick={() => updateWater(water - 1)}>-</Button>
            <Button variant="secondary" onClick={() => updateWater(water + 1)}>+</Button>
          </div>
        </article>
        <article className="nutrition-mini-card">
          <span>Meals Checked</span>
          <strong>{completed}/4</strong>
          <small>{completed < 3 ? "Do not let the day get away from you." : "Nice, the basics are protected."}</small>
        </article>
        <Button onClick={saveDietHistory} className="nutrition-save-button">Save diet history</Button>
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
          <div className="nutrition-meal-grid">
            {(Object.keys(selectedPlan.meals) as MealKey[]).map((key) => (
              <article
                key={key}
                className={"nutrition-meal-card " + (meals[key] ? "is-done" : "")}
              >
                <div>
                  <p className="nutrition-meal-label">{mealLabels[key]}</p>
                  <h2>{selectedPlan.meals[key]}</h2>
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
