import PublicPageShell from "@/components/home/PublicPageShell";
import {
  cardioWorkouts,
  learningImageForSlot,
} from "@/lib/cardio-nutrition-data";

export default function CardioPage() {
  return (
    <PublicPageShell>
      <section className="if-section if-hero-full">
        <p className="if-kicker">Cardio Zone</p>
        <h1 className="if-title">Cardio should match the body, not punish it.</h1>
        <p className="if-copy">
          Treadmill, cycling, rowing, jump rope, stair climber, and HIIT plans
          explained by intensity, duration, beginner progression, and safety.
          Calorie numbers are estimates, not promises.
        </p>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid-lg">
          {cardioWorkouts.map((workout) => (
            <article key={workout.slug} className="if-card" style={{ padding: 0 }}>
              <div
                style={{
                  minHeight: 230,
                  borderRadius: "20px 20px 0 0",
                  backgroundImage: `linear-gradient(180deg, transparent, rgba(0,0,0,.78)), url(${learningImageForSlot(workout.imageSlot)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{ padding: 24 }}>
                <span className="if-tag">{workout.intensity} intensity</span>
                <h2>{workout.name}</h2>
                <p>{workout.type} - {workout.duration}</p>
                <Info label="Beginner" items={workout.beginnerPlan} />
                <Info label="Intermediate" items={workout.intermediatePlan} />
                <Info label="Safety" items={workout.safetyNotes} />
                <p className="if-muted" style={{ marginTop: 16 }}>
                  {workout.calorieNote}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}

function Info({ label, items }: { label: string; items: string[] }) {
  return (
    <div style={{ marginTop: 16 }}>
      <strong style={{ color: "#FBBF24", fontSize: 12 }}>{label}</strong>
      <ul style={{ paddingLeft: 18, marginTop: 8, display: "grid", gap: 6 }}>
        {items.map((item) => (
          <li key={item} className="if-muted">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
