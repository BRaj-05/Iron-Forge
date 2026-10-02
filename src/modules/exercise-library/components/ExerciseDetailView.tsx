import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Dumbbell, ShieldCheck, Wind } from "lucide-react";
import FadeInSection from "@/components/motion/FadeInSection";
import PublicPageShell from "@/components/home/PublicPageShell";
import {
  exerciseImageForExercise,
  exercisePath,
  getExercisesByMuscle,
  getRelatedExercises,
  type Exercise,
} from "@/lib/exercise-data";

export default function ExerciseDetailView({ exercise }: { exercise: Exercise }) {
  const siblings = getExercisesByMuscle(exercise.muscleSlug);
  const index = siblings.findIndex((item) => item.slug === exercise.slug);
  const previous = siblings[(index - 1 + siblings.length) % siblings.length];
  const next = siblings[(index + 1) % siblings.length];
  const related = getRelatedExercises(exercise);

  return (
    <PublicPageShell>
      <section className="exercise-detail-hero">
        <Image
          src={exerciseImageForExercise(exercise)}
          alt={`${exercise.name} exercise`}
          fill
          priority
          unoptimized
          sizes="100vw"
          className="exercise-detail-hero-image"
        />
        <div className="exercise-detail-overlay" />
        <div className="exercise-detail-intro">
          <Link href={`/gym/${exercise.muscleSlug}`} className="exercise-detail-back">
            <ArrowLeft size={16} /> {exercise.muscleGroup} exercises
          </Link>
          <p className="if-kicker">{exercise.difficulty} · Form guide</p>
          <h1>{exercise.name}</h1>
          <p>{exercise.description}</p>
          <div className="exercise-detail-chips">
            {exercise.targetMuscles.map((muscle) => <span key={muscle}>{muscle}</span>)}
          </div>
        </div>
        <aside className="exercise-detail-summary">
          <span>Recommended start</span>
          <strong>{exercise.setsReps.beginner}</strong>
          <small>{exercise.equipment.join(" · ")}</small>
        </aside>
      </section>

      <FadeInSection className="exercise-detail-body">
        <section className="exercise-technique">
          <div className="exercise-section-heading">
            <p className="if-kicker">Technique sequence</p>
            <h2>Move with intent.</h2>
          </div>
          <ol className="exercise-step-list">
            {exercise.steps.map((step, stepIndex) => (
              <li key={step}>
                <span>{String(stepIndex + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <aside className="exercise-cue-panel">
          <GuideBlock icon={<Check />} title="Posture" items={exercise.postureChecklist} />
          <GuideBlock icon={<Wind />} title="Breathing" items={[exercise.breathing]} />
          <GuideBlock icon={<ShieldCheck />} title="Safety" items={exercise.safetyNotes} />
        </aside>
      </FadeInSection>

      <FadeInSection className="exercise-detail-section">
        <div className="exercise-section-heading">
          <p className="if-kicker">Progression</p>
          <h2>Choose the right training dose.</h2>
        </div>
        <div className="exercise-level-grid">
          <LevelCard number="01" title="Beginner" value={exercise.setsReps.beginner} />
          <LevelCard number="02" title="Intermediate" value={exercise.setsReps.intermediate} />
          <LevelCard number="03" title="Advanced" value={exercise.setsReps.advanced} />
        </div>
      </FadeInSection>

      <FadeInSection className="exercise-detail-section">
        <div className="exercise-detail-two-column">
          <article className="exercise-dark-card">
            <Dumbbell size={24} />
            <p className="if-kicker">Common mistakes</p>
            <h2>Keep these out of every rep.</h2>
            <ul>{exercise.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article className="exercise-dark-card is-accent">
            <p className="if-kicker">Alternative movements</p>
            <h2>Same goal, different setup.</h2>
            <ul>{exercise.alternatives.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </div>
      </FadeInSection>

      {exercise.youtubeId && (
        <FadeInSection className="exercise-detail-section">
          <div className="exercise-video-frame">
            <iframe
              title={`${exercise.name} video`}
              src={`https://www.youtube.com/embed/${exercise.youtubeId}`}
              allowFullScreen
            />
          </div>
        </FadeInSection>
      )}

      <FadeInSection className="exercise-detail-section">
        <div className="exercise-section-heading">
          <p className="if-kicker">Stay in the flow</p>
          <h2>More movements worth learning.</h2>
        </div>
        <div className="exercise-related-grid">
          {related.map((item) => (
            <Link href={exercisePath(item)} key={item.slug}>
              <Image src={exerciseImageForExercise(item)} alt="" fill unoptimized sizes="(max-width: 700px) 100vw, 25vw" />
              <span>{item.muscleGroup}</span>
              <strong>{item.name}</strong>
            </Link>
          ))}
        </div>
      </FadeInSection>

      <nav className="exercise-pagination" aria-label="Exercise navigation">
        <Link href={exercisePath(previous)}>
          <ArrowLeft /> <span><small>Previous exercise</small><strong>{previous.name}</strong></span>
        </Link>
        <Link href={exercisePath(next)}>
          <span><small>Next exercise</small><strong>{next.name}</strong></span> <ArrowRight />
        </Link>
      </nav>
    </PublicPageShell>
  );
}

function GuideBlock({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <section>
      <span className="exercise-cue-icon">{icon}</span>
      <div><h3>{title}</h3>{items.map((item) => <p key={item}>{item}</p>)}</div>
    </section>
  );
}

function LevelCard({ number, title, value }: { number: string; title: string; value: string }) {
  return <article><span>{number}</span><small>{title}</small><strong>{value}</strong></article>;
}
