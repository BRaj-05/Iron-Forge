import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

const dayMs = 24 * 60 * 60 * 1000;

function keyFor(offset: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function scoreDay(hasAttendance: boolean, workoutCompleted: boolean, dietCompleted: boolean, metricLogged: boolean) {
  return (hasAttendance ? 25 : 0) + (workoutCompleted ? 35 : 0) + (dietCompleted ? 25 : 0) + (metricLogged ? 15 : 0);
}

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const customerId = url.searchParams.get("customerId") || session.userId;

  if (session.role === "CUSTOMER" && customerId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (session.role === "TRAINER") {
    const customer = await prisma.user.findFirst({
      where: { id: customerId, assignedTrainerId: session.userId },
      select: { id: true },
    });
    if (!customer) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const keys = Array.from({ length: 7 }, (_, index) => keyFor(index - 6));
  const fromDate = new Date(Date.now() - 31 * dayMs);
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [attendance, workouts, diets, metrics] = await Promise.all([
    prisma.attendance.findMany({ where: { customerId, logDate: { in: keys } } }),
    prisma.dailyWorkoutLog.findMany({ where: { customerId, logDate: { in: keys } } }),
    prisma.dailyDietLog.findMany({ where: { customerId, logDate: { in: keys } } }),
    prisma.bodyMetricLog.findMany({ where: { customerId, createdAt: { gte: fromDate } }, orderBy: { createdAt: "asc" } }),
  ]);

  const weekly = keys.map((logDate) => {
    const date = new Date(`${logDate}T00:00:00`);
    const workout = workouts.find((item) => item.logDate === logDate);
    const diet = diets.find((item) => item.logDate === logDate);
    const metric = metrics.find((item) => item.logDate === logDate);
    const score = scoreDay(
      attendance.some((item) => item.logDate === logDate),
      Boolean(workout?.completed),
      Boolean(diet?.completed),
      Boolean(metric),
    );
    return { day: labels[date.getDay()], logDate, xp: score, score };
  });

  const weeklyXP = weekly.reduce((sum, item) => sum + item.xp, 0);
  const avgScore = weekly.length ? Math.round(weekly.reduce((sum, item) => sum + item.score, 0) / weekly.length) : 0;
  const firstWeight = metrics.find((item) => typeof item.weightKg === "number")?.weightKg;
  const lastWeight = [...metrics].reverse().find((item) => typeof item.weightKg === "number")?.weightKg;
  const weightTrend = firstWeight && lastWeight ? Number((lastWeight - firstWeight).toFixed(1)) : 0;

  return NextResponse.json({
    weeklyXP,
    avgScore,
    weightTrend,
    level: Math.floor(weeklyXP / 100) + 1,
    streak: weekly.filter((item) => item.score > 0).length,
    weekly,
    body: metrics.map((item, index) => ({
      week: `#${index + 1}`,
      weight: item.weightKg || 0,
      height: item.heightCm || 0,
    })),
  });
}
