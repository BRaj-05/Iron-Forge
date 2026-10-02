import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/infrastructure/prisma/client";
import { dateKey } from "@/lib/daily";
import { requireRole } from "@/lib/session";

const ExerciseEntrySchema = z.object({
  name: z.string().trim().min(1),
  sets: z.coerce.number().int().min(0).default(0),
  reps: z.coerce.number().int().min(0).default(0),
  weightKg: z.coerce.number().min(0).default(0),
  done: z.boolean().default(false),
});

const MealEntrySchema = z.object({
  name: z.string().trim().min(1),
  food: z.string().trim().min(1),
  done: z.boolean().default(false),
});

const DailyLogSchema = z.object({
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default(dateKey()),
  workoutName: z.string().trim().min(2).default("Daily workout"),
  exercises: z.array(ExerciseEntrySchema).min(1),
  workoutCompleted: z.boolean().default(false),
  workoutNotes: z.string().trim().optional(),
  meals: z.array(MealEntrySchema).min(1),
  waterCups: z.coerce.number().int().min(0).max(40).default(0),
  dietCompleted: z.boolean().default(false),
  dietNotes: z.string().trim().optional(),
  weightKg: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.number().positive().optional(),
  ),
  heightCm: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.number().positive().optional(),
  ),
  metricNotes: z.string().trim().optional(),
});

export async function GET(request: Request) {
  const auth = await requireRole(request, ["CUSTOMER"]);
  if (auth.response || !auth.session) return auth.response;

  const url = new URL(request.url);
  const logDate = url.searchParams.get("date") || dateKey();

  const [workout, diet, metric] = await Promise.all([
    prisma.dailyWorkoutLog.findUnique({
      where: { customerId_logDate: { customerId: auth.session.userId, logDate } },
    }),
    prisma.dailyDietLog.findUnique({
      where: { customerId_logDate: { customerId: auth.session.userId, logDate } },
    }),
    prisma.bodyMetricLog.findUnique({
      where: { customerId_logDate: { customerId: auth.session.userId, logDate } },
    }),
  ]);

  return NextResponse.json({ logDate, workout, diet, metric });
}

export async function POST(request: Request) {
  const auth = await requireRole(request, ["CUSTOMER"]);
  if (auth.response || !auth.session) return auth.response;

  const parsed = DailyLogSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Workout, diet, and body tracking are required." }, { status: 400 });
  }

  const customer = await prisma.user.findUnique({
    where: { id: auth.session.userId },
    select: { assignedTrainerId: true },
  });

  const [workout, diet, metric] = await prisma.$transaction([
    prisma.dailyWorkoutLog.upsert({
      where: { customerId_logDate: { customerId: auth.session.userId, logDate: parsed.data.logDate } },
      update: {
        trainerId: customer?.assignedTrainerId,
        workoutName: parsed.data.workoutName,
        exercises: parsed.data.exercises,
        completed: parsed.data.workoutCompleted,
        notes: parsed.data.workoutNotes,
      },
      create: {
        customerId: auth.session.userId,
        trainerId: customer?.assignedTrainerId,
        logDate: parsed.data.logDate,
        workoutName: parsed.data.workoutName,
        exercises: parsed.data.exercises,
        completed: parsed.data.workoutCompleted,
        notes: parsed.data.workoutNotes,
      },
    }),
    prisma.dailyDietLog.upsert({
      where: { customerId_logDate: { customerId: auth.session.userId, logDate: parsed.data.logDate } },
      update: {
        meals: parsed.data.meals,
        waterCups: parsed.data.waterCups,
        completed: parsed.data.dietCompleted,
        notes: parsed.data.dietNotes,
      },
      create: {
        customerId: auth.session.userId,
        logDate: parsed.data.logDate,
        meals: parsed.data.meals,
        waterCups: parsed.data.waterCups,
        completed: parsed.data.dietCompleted,
        notes: parsed.data.dietNotes,
      },
    }),
    prisma.bodyMetricLog.upsert({
      where: { customerId_logDate: { customerId: auth.session.userId, logDate: parsed.data.logDate } },
      update: {
        weightKg: parsed.data.weightKg,
        heightCm: parsed.data.heightCm,
        notes: parsed.data.metricNotes,
      },
      create: {
        customerId: auth.session.userId,
        logDate: parsed.data.logDate,
        weightKg: parsed.data.weightKg,
        heightCm: parsed.data.heightCm,
        notes: parsed.data.metricNotes,
      },
    }),
  ]);

  if (parsed.data.weightKg || parsed.data.heightCm) {
    await prisma.user.update({
      where: { id: auth.session.userId },
      data: {
        weightKg: parsed.data.weightKg,
        heightCm: parsed.data.heightCm,
      },
    });
  }

  return NextResponse.json({ workout, diet, metric });
}
