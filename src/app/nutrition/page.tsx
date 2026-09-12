import PublicPageShell from "@/components/home/PublicPageShell";
import {
  learningImageForSlot,
  nutritionPlans,
} from "@/lib/cardio-nutrition-data";

export default function NutritionPage() {
  return (
    <PublicPageShell>
      <section className="if-section if-hero">
        <div>
          <p className="if-kicker">Nutrition</p>
          <h1 className="if-title">Diet charts that teach habits, not fear.</h1>
          <p className="if-copy">
            Goal-based meal examples for muscle gain, fat loss, vegetarian high
            protein, pre/post workout fueling, and maintenance. This is general
            education, not a medical diet prescription.
          </p>
        </div>
        <aside
          className="if-card"
          style={{
            minHeight: 360,
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.18), rgba(0,0,0,.82)), url(${learningImageForSlot("NUTRITION")})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <span className="if-tag">Daily Meal Chart</span>
          <h2>Breakfast. Lunch. Snack. Dinner. Water.</h2>
        </aside>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid-lg">
          {nutritionPlans.map((plan) => (
            <article key={plan.slug} className="if-card">
              <span className="if-tag">{plan.goal}</span>
              <h2>{plan.name}</h2>
              <p>{plan.dietType} - {plan.caloriesRange}</p>
              <Info label="Protein target" value={plan.proteinTarget} />
              <Meal label="Breakfast" value={plan.meals.breakfast} />
              <Meal label="Lunch" value={plan.meals.lunch} />
              <Meal label="Evening snack" value={plan.meals.snack} />
              <Meal label="Dinner" value={plan.meals.dinner} />
              <Info label="Notes" value={plan.notes.join(" ")} />
              <Info label="Warnings" value={plan.warnings.join(" ")} />
            </article>
          ))}
        </div>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-card">
          <span className="if-tag">Medical Safety</span>
          <h2>Use this as education, not diagnosis.</h2>
          <p>
            Diabetes, kidney disease, heart disease, pregnancy, eating
            disorders, severe obesity, medication use, and food allergies need
            a doctor or qualified dietitian. Iron Forge nutrition content is a
            starting point for habits and conversation with professionals.
          </p>
        </div>
      </section>
    </PublicPageShell>
  );
}

function Meal({ label, value }: { label: string; value: string }) {
  return (
    <div className="if-row" style={{ gridTemplateColumns: "150px 1fr", marginTop: 12 }}>
      <strong style={{ color: "#FBBF24" }}>{label}</strong>
      <span className="if-muted">{value}</span>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginTop: 14 }}>
      <strong style={{ display: "block", color: "#FBBF24", fontSize: 12 }}>
        {label}
      </strong>
      <span className="if-muted">{value}</span>
    </div>
  );
}
