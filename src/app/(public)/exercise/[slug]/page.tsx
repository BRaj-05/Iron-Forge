import { notFound, redirect } from "next/navigation";
import { exercisePath, getExerciseBySlug } from "@/lib/exercise-data";

export default async function LegacyExercisePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exercise = getExerciseBySlug(slug);
  if (!exercise) notFound();
  redirect(exercisePath(exercise));
}
