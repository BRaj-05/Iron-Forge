import Link from "next/link";
import PublicPageShell from "@/components/home/PublicPageShell";
import { exercises, muscleGroups } from "@/lib/exercise-data";

export default function GymLibraryPage() {
  return (
    <PublicPageShell>
      <section className="if-section if-hero-full">
        <p className="if-kicker">Gym Exercise Library</p>
        <h1 className="if-title">Learn the muscle before loading the bar.</h1>
        <p className="if-copy">
          Browse every major muscle group with target muscles, example
          exercises, equipment, difficulty, and beginner-friendly direction.
          Phase 2 keeps this education layer static and seedable, ready for
          admin CRUD later.
        </p>
        <div className="if-actions">
          <Link href="/gym/chest" className="if-button">
            Start With Chest
          </Link>
          <Link href="/equipment" className="if-button-secondary">
            Equipment Guide
          </Link>
        </div>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid">
          {muscleGroups.map((group) => {
            const count = exercises.filter(
              (exercise) => exercise.muscleSlug === group.slug,
            ).length;

            return (
              <Link
                key={group.slug}
                href={`/gym/${group.slug}`}
                className="if-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="if-tag">{count} exercises</span>
                <h2>{group.name}</h2>
                <p>{group.focus}</p>
                <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
                  <Info label="Targets" value={group.targetMuscles.join(", ")} />
                  <Info label="Examples" value={group.exampleExercises.join(", ")} />
                  <Info label="Equipment" value={group.equipmentNeeded.slice(0, 3).join(", ")} />
                  <Info label="Difficulty" value={group.difficulty} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </PublicPageShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <strong style={{ display: "block", color: "#FBBF24", fontSize: 12 }}>
        {label}
      </strong>
      <span className="if-muted">{value}</span>
    </div>
  );
}
