import Link from "next/link";
import { notFound } from "next/navigation";
import PublicPageShell from "@/components/home/PublicPageShell";
import {
  getExercisesByMuscle,
  getMuscleGroup,
  exerciseImageForExercise,
  exerciseImageForSlot,
  muscleGroups,
} from "@/lib/exercise-data";

export function generateStaticParams() {
  return muscleGroups.map((group) => ({ muscle: group.slug }));
}

export default async function MusclePage({
  params,
}: {
  params: Promise<{ muscle: string }>;
}) {
  const { muscle } = await params;
  const group = getMuscleGroup(muscle);
  if (!group) notFound();

  const groupExercises = getExercisesByMuscle(group.slug);

  return (
    <PublicPageShell>
      <section
        className="if-section if-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(10,10,15,0.92), rgba(10,10,15,0.58)), url(${exerciseImageForSlot(group.imageSlot)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: 500,
        }}
      >
        <div>
        <p className="if-kicker">{group.name} Training</p>
        <h1 className="if-title">{group.name} exercises with form-first cues.</h1>
        <p className="if-copy">{group.focus}</p>
        <div className="if-actions">
          <Link href="/gym" className="if-button-secondary">
            All Muscles
          </Link>
          <Link href={`/exercise/${groupExercises[0]?.slug}`} className="if-button">
            View First Exercise
          </Link>
        </div>
        </div>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid-lg">
          {groupExercises.map((exercise) => (
            <Link
              key={exercise.slug}
              href={`/exercise/${exercise.slug}`}
              className="if-card"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <div
                style={{
                  minHeight: 150,
                  borderRadius: 10,
                  marginBottom: 16,
                  backgroundImage: `linear-gradient(180deg, rgba(10,10,15,0.08), rgba(10,10,15,0.7)), url(${exerciseImageForExercise(exercise)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transition: "transform 0.28s ease, filter 0.28s ease",
                }}
              />
              <span className="if-tag">{exercise.difficulty}</span>
              <h2>{exercise.name}</h2>
              <p>{exercise.description}</p>
              <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
                <Info label="Target" value={exercise.targetMuscles.slice(0, 3).join(", ")} />
                <Info label="Equipment" value={exercise.equipment.join(", ")} />
                <Info label="Sets/Reps" value={exercise.setsReps.beginner} />
                <Info label="Main Benefit" value={exercise.mainBenefit} />
              </div>
            </Link>
          ))}
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
