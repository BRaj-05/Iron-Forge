import { notFound } from "next/navigation";
import ExerciseDetailView from "@/modules/exercise-library/components/ExerciseDetailView";
import {
  exercises,
  getExerciseBySlug,
  getMuscleGroup,
} from "@/lib/exercise-data";

export function generateStaticParams() {
  return exercises.map((exercise) => ({
    muscle: exercise.muscleSlug,
    exercise: exercise.slug,
  }));
}

export default async function ExercisePage({
  params,
}: {
  params: Promise<{ muscle: string; exercise: string }>;
}) {
  const { muscle, exercise: slug } = await params;
  const group = getMuscleGroup(muscle);
  const exercise = getExerciseBySlug(slug);

  if (!group || !exercise || exercise.muscleSlug !== group.slug) notFound();
  return <ExerciseDetailView exercise={exercise} />;
}
