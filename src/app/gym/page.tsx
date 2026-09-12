import Link from "next/link";
import PublicPageShell from "@/components/home/PublicPageShell";
import { exerciseImageForExercise, exerciseImageForSlot, exercises, muscleGroups } from "@/lib/exercise-data";

export default async function GymLibraryPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const search = params?.search?.trim().toLowerCase() || "";
  const filteredExercises = search
    ? exercises.filter((exercise) =>
        [
          exercise.name,
          exercise.muscleGroup,
          exercise.mainBenefit,
          exercise.equipment.join(" "),
          exercise.targetMuscles.join(" "),
        ].join(" ").toLowerCase().includes(search),
      )
    : [];

  return (
    <PublicPageShell>
      <section
        className="if-section if-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(10,10,15,0.92), rgba(10,10,15,0.62)), url(${exerciseImageForSlot("FULL_BODY")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: 520,
        }}
      >
        <div>
        <p className="if-kicker">Gym Exercise Library</p>
        <h1 className="if-title">Learn the muscle before loading the bar.</h1>
        <p className="if-copy">
          Browse every major muscle group with target muscles, example exercises,
          equipment, difficulty, and beginner-friendly direction.
        </p>
        <div className="if-actions">
          <Link href="/gym/chest" className="if-button">
            Start With Chest
          </Link>
          <Link href="/equipment" className="if-button-secondary">
            Equipment Guide
          </Link>
        </div>
        </div>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        {search && (
          <div style={{ marginBottom: 28 }}>
            <span className="if-tag">Search</span>
            <h2>Results for {search}</h2>
            <div className="if-grid" style={{ marginTop: 18 }}>
              {filteredExercises.length ? filteredExercises.map((exercise) => (
                <Link key={exercise.slug} href={`/exercise/${exercise.slug}`} className="if-card" style={{ color: "inherit", textDecoration: "none", padding: 0 }}>
                  <div
                    style={{
                      minHeight: 180,
                      backgroundImage: `linear-gradient(180deg, rgba(10,10,15,0.02), rgba(10,10,15,0.72)), url(${exerciseImageForExercise(exercise)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div style={{ padding: 18 }}>
                    <span className="if-tag">{exercise.muscleGroup}</span>
                    <h3>{exercise.name}</h3>
                    <p>{exercise.mainBenefit}</p>
                  </div>
                </Link>
              )) : <p className="if-muted">No exact match yet. Try chest, back, biceps, legs, or equipment names.</p>}
            </div>
          </div>
        )}
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
                <div
                  style={{
                    minHeight: 160,
                    borderRadius: 10,
                    marginBottom: 16,
                    backgroundImage: `linear-gradient(180deg, rgba(10,10,15,0.08), rgba(10,10,15,0.65)), url(${exerciseImageForSlot(group.imageSlot)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
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
