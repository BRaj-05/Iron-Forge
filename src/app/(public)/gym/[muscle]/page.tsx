import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowLeft } from "lucide-react";
import PublicPageShell from "@/components/home/PublicPageShell";
import MuscleExerciseShowcase from "@/modules/exercise-library/components/MuscleExerciseShowcase";
import {
  exerciseImageForSlot,
  getExercisesByMuscle,
  getMuscleGroup,
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
      <section className="muscle-hero">
        <Image
          src={exerciseImageForSlot(group.imageSlot)}
          alt={`${group.name} training`}
          fill
          priority
          unoptimized
          sizes="100vw"
          className="muscle-hero-image"
        />
        <div className="muscle-hero-overlay" />
        <div className="muscle-hero-content">
          <Link href="/gym" className="exercise-detail-back"><ArrowLeft size={16} /> Exercise library</Link>
          <p className="if-kicker">{String(groupExercises.length).padStart(2, "0")} guided exercises</p>
          <h1>{group.name}</h1>
          <p>{group.focus}</p>
          <div className="muscle-hero-meta">
            <span><small>Primary targets</small>{group.targetMuscles.join(" · ")}</span>
            <span><small>Equipment</small>{group.equipmentNeeded.slice(0, 3).join(" · ")}</span>
          </div>
        </div>
        <a href="#exercise-showcase" className="muscle-scroll-cue">
          Explore movements <ArrowDown size={17} />
        </a>
      </section>

      <div id="exercise-showcase">
        <MuscleExerciseShowcase group={group} exercises={groupExercises} />
      </div>
    </PublicPageShell>
  );
}
