import Link from "next/link";
import { notFound } from "next/navigation";
import PublicPageShell from "@/components/home/PublicPageShell";
import {
  exercises,
  exerciseImageForExercise,
  getExerciseBySlug,
  getRelatedExercises,
} from "@/lib/exercise-data";

export function generateStaticParams() {
  return exercises.map((exercise) => ({ slug: exercise.slug }));
}

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exercise = getExerciseBySlug(slug);
  if (!exercise) notFound();

  const related = getRelatedExercises(exercise);

  return (
    <PublicPageShell>
      <section
        className="if-section if-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(10,10,15,0.9), rgba(10,10,15,0.52)), url(${exerciseImageForExercise(exercise)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: 500,
        }}
      >
        <div>
          <p className="if-kicker">{exercise.muscleGroup} Exercise</p>
          <h1 className="if-title">{exercise.name}</h1>
          <p className="if-copy">{exercise.description}</p>
          <div className="if-actions">
            <Link href={`/gym/${exercise.muscleSlug}`} className="if-button-secondary">
              Back To {exercise.muscleGroup}
            </Link>
            <Link href="/equipment" className="if-button-secondary">
              Equipment Guide
            </Link>
          </div>
        </div>

        <aside className="if-card">
          <span className="if-tag">{exercise.difficulty}</span>
          <h2>Quick Setup</h2>
          <Info label="Target" value={exercise.targetMuscles.join(", ")} />
          <Info label="Secondary" value={exercise.secondaryMuscles.join(", ")} />
          <Info label="Equipment" value={exercise.equipment.join(", ")} />
          <Info label="Goal Tags" value={exercise.goalTags.join(", ")} />
        </aside>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid-lg">
          <Panel title="Step-by-step technique" items={exercise.steps} />
          <Panel title="Correct posture checklist" items={exercise.postureChecklist} />
          <Panel title="Common mistakes" items={exercise.commonMistakes} />
          <Panel title="Safety notes" items={exercise.safetyNotes} />
        </div>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid-lg">
          <article className="if-card">
            <span className="if-tag">Breathing</span>
            <h2>Breathing pattern</h2>
            <p>{exercise.breathing}</p>
          </article>

          <article className="if-card">
            <span className="if-tag">Sets and Reps</span>
            <div style={{ display: "grid", gap: 12 }}>
              <Info label="Beginner" value={exercise.setsReps.beginner} />
              <Info label="Intermediate" value={exercise.setsReps.intermediate} />
              <Info label="Advanced" value={exercise.setsReps.advanced} />
            </div>
          </article>

          <article className="if-card">
            <span className="if-tag">No Equipment?</span>
            <h2>Alternatives</h2>
            <ul style={{ display: "grid", gap: 10, paddingLeft: 18 }}>
              {exercise.alternatives.map((item) => (
                <li key={item} className="if-muted">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-card">
          <span className="if-tag">Video Placeholder</span>
          {exercise.youtubeId ? (
            <iframe
              title={`${exercise.name} video`}
              src={`https://www.youtube.com/embed/${exercise.youtubeId}`}
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                border: 0,
                borderRadius: 18,
                marginTop: 16,
              }}
              allowFullScreen
            />
          ) : (
            <div
              style={{
                minHeight: 280,
                borderRadius: 20,
                border: "1px dashed rgba(255,255,255,.22)",
                display: "grid",
                placeItems: "center",
                color: "rgba(241,245,249,.62)",
                marginTop: 16,
                textAlign: "center",
                padding: 24,
              }}
            >
              YouTube video can be connected later through the exercise content
              manager using the youtubeId field.
            </div>
          )}
        </div>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <p className="if-kicker">Related Exercises</p>
        <h2 className="if-title-sm">Keep learning the same pattern.</h2>
        <div className="if-grid" style={{ marginTop: 24 }}>
          {related.map((item) => (
            <Link
              key={item.slug}
              href={`/exercise/${item.slug}`}
            className="if-card"
            style={{ color: "inherit", textDecoration: "none" }}
          >
              <div
                style={{
                  minHeight: 120,
                  borderRadius: 10,
                  marginBottom: 14,
                  backgroundImage: `linear-gradient(180deg, rgba(10,10,15,0.1), rgba(10,10,15,0.72)), url(${exerciseImageForExercise(item)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <span className="if-tag">{item.muscleGroup}</span>
              <h3>{item.name}</h3>
              <p>{item.mainBenefit}</p>
            </Link>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginTop: 12 }}>
      <strong style={{ display: "block", color: "#FBBF24", fontSize: 12 }}>
        {label}
      </strong>
      <span className="if-muted">{value}</span>
    </div>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="if-card">
      <span className="if-tag">Guide</span>
      <h2>{title}</h2>
      <ol style={{ display: "grid", gap: 12, paddingLeft: 20 }}>
        {items.map((item) => (
          <li key={item} className="if-muted">
            {item}
          </li>
        ))}
      </ol>
    </article>
  );
}
