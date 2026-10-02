import Link from "next/link";
import Image from "next/image";
import FadeInSection from "@/components/motion/FadeInSection";
import PublicPageShell from "@/components/home/PublicPageShell";
import { exerciseImageForExercise, exerciseImageForSlot, exercisePath, exercises, muscleGroups } from "@/lib/exercise-data";

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

      <FadeInSection className="if-section" style={{ paddingTop: 0 }}>
        {search && (
          <div style={{ marginBottom: 28 }}>
            <span className="if-tag">Search</span>
            <h2>Results for {search}</h2>
            <div className="if-grid" style={{ marginTop: 18 }}>
              {filteredExercises.length ? filteredExercises.map((exercise) => (
                <Link key={exercise.slug} href={exercisePath(exercise)} className="if-card" style={{ color: "inherit", textDecoration: "none", padding: 0 }}>
                  <div
                    style={{
                      position: "relative",
                      minHeight: 180,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={exerciseImageForExercise(exercise)}
                      alt={`${exercise.name} exercise`}
                      fill
                      sizes="(max-width: 800px) 100vw, 33vw"
                      unoptimized
                      style={{ objectFit: "cover" }}
                    />
                    <div style={styles.imageOverlay} />
                  </div>
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
                    position: "relative",
                    minHeight: 160,
                    borderRadius: 10,
                    marginBottom: 16,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={exerciseImageForSlot(group.imageSlot)}
                    alt={`${group.name} training`}
                    fill
                    sizes="(max-width: 800px) 100vw, 33vw"
                    unoptimized
                    style={{ objectFit: "cover" }}
                  />
                  <div style={styles.imageOverlay} />
                </div>
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
      </FadeInSection>
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

const styles: Record<string, React.CSSProperties> = {
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(10,10,15,0.08), rgba(10,10,15,0.68))",
  },
};
