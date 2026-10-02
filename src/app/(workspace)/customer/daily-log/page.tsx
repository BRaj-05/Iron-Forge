"use client";

import { useEffect, useState } from "react";
import { Check, Dumbbell, GlassWater, Utensils } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeading from "@/components/ui/PageHeading";
import Panel from "@/components/ui/Panel";
import { Checkbox, Input, Textarea } from "@/components/ui/FormField";
import { jsonRequest } from "@/modules/customer/api";
import { useCustomerDashboard } from "@/modules/customer/useCustomerDashboard";
import type { ExerciseEntry, MealEntry } from "@/modules/customer/types";
import { apiRoutes } from "@/config/api-routes";

type ExerciseForm = { name: string; sets: string; reps: string; weightKg: string };
const starterExercises: ExerciseForm[] = [{ name: "", sets: "3", reps: "10", weightKg: "" }, { name: "", sets: "3", reps: "10", weightKg: "" }, { name: "", sets: "3", reps: "10", weightKg: "" }];

export default function DailyLogPage() {
  const { data, loading, error, refresh } = useCustomerDashboard();
  const [workoutName, setWorkoutName] = useState("Today’s workout");
  const [exercises, setExercises] = useState(starterExercises);
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [meals, setMeals] = useState({ Breakfast: "", Lunch: "", Dinner: "" });
  const [waterCups, setWaterCups] = useState("6");
  const [dietCompleted, setDietCompleted] = useState(false);
  const [bodyNotes, setBodyNotes] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!data?.daily) return;
    const savedExercises = Array.isArray(data.daily.workout?.exercises) ? data.daily.workout.exercises as ExerciseEntry[] : [];
    const savedMeals = Array.isArray(data.daily.diet?.meals) ? data.daily.diet.meals as MealEntry[] : [];
    setWorkoutName(data.daily.workout?.workoutName || "Today’s workout");
    setExercises(starterExercises.map((fallback, index) => savedExercises[index] ? { name: savedExercises[index].name, sets: String(savedExercises[index].sets ?? ""), reps: String(savedExercises[index].reps ?? ""), weightKg: String(savedExercises[index].weightKg ?? "") } : fallback));
    setWorkoutNotes(data.daily.workout?.notes || ""); setWorkoutCompleted(Boolean(data.daily.workout?.completed));
    setMeals({ Breakfast: savedMeals.find((item) => item.name === "Breakfast")?.food || "", Lunch: savedMeals.find((item) => item.name === "Lunch")?.food || "", Dinner: savedMeals.find((item) => item.name === "Dinner")?.food || "" });
    setWaterCups(String(data.daily.diet?.waterCups ?? 6)); setDietCompleted(Boolean(data.daily.diet?.completed)); setBodyNotes(data.daily.metric?.notes || "");
  }, [data]);
  function updateExercise(index: number, key: keyof ExerciseForm, value: string) { setExercises((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item)); }
  async function save() {
    const validExercises = exercises.filter((item) => item.name.trim()).map((item) => ({ ...item, done: workoutCompleted }));
    if (!validExercises.length) { toast.error("Add at least one exercise."); return; }
    setSaving(true);
    try {
      await jsonRequest(apiRoutes.customer.dailyLog, "POST", { workoutName, exercises: validExercises, workoutCompleted, workoutNotes, meals: Object.entries(meals).map(([name, food]) => ({ name, food: food || "Not entered", done: Boolean(food) })), waterCups, dietCompleted, dietNotes: Object.values(meals).join(" ").trim(), weightKg: data?.user.weightKg || undefined, heightCm: data?.user.heightCm || undefined, metricNotes: bodyNotes });
      toast.success("Today’s log is saved."); await refresh();
    } catch (reason) { toast.error(reason instanceof Error ? reason.message : "Could not save today’s log."); }
    finally { setSaving(false); }
  }
  if (loading) return <div className="skeleton dashboard-title-skeleton" />;
  if (!data) return <Card className="dashboard-error">{error || "Could not load today’s log."}</Card>;
  return <div className="dashboard-page compact-page">
    <PageHeading eyebrow="Daily check-in" title="Log today’s work" description="A focused place for today’s training, food, hydration, and recovery notes." action={<Button onClick={() => void save()} disabled={saving}>{saving ? "Saving…" : "Save today’s log"}</Button>} />
    <section className="daily-log-grid">
      <Panel title="Workout" description="What you trained today." action={<span className="panel-icon"><Dumbbell size={18} /></span>}>
        <div className="daily-form-stack"><Input label="Workout name" value={workoutName} onChange={(event) => setWorkoutName(event.target.value)} />
          {exercises.map((exercise, index) => <div className="exercise-fields" key={index}><Input label={`Exercise ${index + 1}`} value={exercise.name} placeholder="Exercise name" onChange={(event) => updateExercise(index, "name", event.target.value)} /><Input label="Sets" type="number" min="0" value={exercise.sets} onChange={(event) => updateExercise(index, "sets", event.target.value)} /><Input label="Reps" type="number" min="0" value={exercise.reps} onChange={(event) => updateExercise(index, "reps", event.target.value)} /><Input label="Kg" type="number" min="0" value={exercise.weightKg} onChange={(event) => updateExercise(index, "weightKg", event.target.value)} /></div>)}
          <Textarea label="Workout notes" placeholder="Energy, form, pain, or a personal best…" value={workoutNotes} onChange={(event) => setWorkoutNotes(event.target.value)} /><Checkbox label="I completed today’s workout" checked={workoutCompleted} onChange={(event) => setWorkoutCompleted(event.target.checked)} /></div>
      </Panel>
      <div className="daily-side-stack">
        <Panel title="Meals & hydration" description="Small entries are enough." action={<span className="panel-icon"><Utensils size={18} /></span>}><div className="daily-form-stack">{Object.entries(meals).map(([name, food]) => <Input key={name} label={name} value={food} placeholder={`What did you have for ${name.toLowerCase()}?`} onChange={(event) => setMeals((current) => ({ ...current, [name]: event.target.value }))} />)}<Input label="Cups of water" type="number" min="0" max="40" value={waterCups} onChange={(event) => setWaterCups(event.target.value)} /><Checkbox label="I followed my nutrition plan" checked={dietCompleted} onChange={(event) => setDietCompleted(event.target.checked)} /></div></Panel>
        <Panel title="How you feel" description="Give your trainer useful context." action={<span className="panel-icon"><GlassWater size={18} /></span>}><Textarea label="Body and recovery notes" placeholder="Energy, soreness, sleep, or anything your trainer should know…" value={bodyNotes} onChange={(event) => setBodyNotes(event.target.value)} /></Panel>
      </div>
    </section>
    <div className="daily-save-bar"><span><Check size={17} /> Your changes are saved only when you press the button.</span><Button onClick={() => void save()} disabled={saving}>{saving ? "Saving…" : "Save today’s log"}</Button></div>
  </div>;
}
