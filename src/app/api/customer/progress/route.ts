import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/prisma/client";
import { getSessionFromRequest } from "@/lib/session";

const dayMs = 24 * 60 * 60 * 1000;

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function keyFor(offset: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return formatLocalDate(date);
}

function keyFromDate(date: Date | string | null | undefined) {
  if (!date) return "";
  return formatLocalDate(new Date(date));
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

  const [customer, attendance, workouts, diets, metrics] = await Promise.all([
    prisma.user.findUnique({ where: { id: customerId }, select: { heightCm: true, weightKg: true } }),
    prisma.attendance.findMany({ where: { customerId }, orderBy: { checkIn: "asc" } }),
    prisma.dailyWorkoutLog.findMany({ where: { customerId, completed: true }, orderBy: { createdAt: "asc" } }),
    prisma.dailyDietLog.findMany({ where: { customerId, completed: true }, orderBy: { createdAt: "asc" } }),
    prisma.bodyMetricLog.findMany({ where: { customerId, createdAt: { gte: fromDate } }, orderBy: { createdAt: "asc" } }),
  ]);

  const attendanceKeys = new Set(attendance.map((item) => item.logDate || keyFromDate(item.checkIn)).filter(Boolean));
  const workoutKeys = new Set(workouts.map((item) => item.logDate || keyFromDate(item.createdAt)).filter(Boolean));
  const dietKeys = new Set(diets.map((item) => item.logDate || keyFromDate(item.createdAt)).filter(Boolean));
  const metricKeys = new Set(metrics.map((item) => item.logDate || keyFromDate(item.createdAt)).filter(Boolean));

  const weekly = keys.map((logDate) => {
    const date = new Date(`${logDate}T00:00:00`);
    const score = scoreDay(
      attendanceKeys.has(logDate),
      workoutKeys.has(logDate),
      dietKeys.has(logDate),
      metricKeys.has(logDate),
    );
    return { day: labels[date.getDay()], logDate, xp: score, score };
  });

  const weeklyXP = weekly.reduce((sum, item) => sum + item.xp, 0);
  const totalXP = attendanceKeys.size * 25 + workoutKeys.size * 35 + dietKeys.size * 25 + metricKeys.size * 15;
  const activeDays = new Set([...attendanceKeys, ...workoutKeys, ...dietKeys, ...metricKeys]).size;
  const avgScore = activeDays ? Math.round(totalXP / activeDays) : 0;
  const firstWeight = metrics.find((item) => typeof item.weightKg === "number")?.weightKg;
  const lastWeight = [...metrics].reverse().find((item) => typeof item.weightKg === "number")?.weightKg;
  const weightTrend = firstWeight && lastWeight ? Number((lastWeight - firstWeight).toFixed(1)) : 0;
  const body = metrics.map((item, index) => ({
    week: `#${index + 1}`,
    weight: item.weightKg || 0,
    height: item.heightCm || 0,
  }));

  if (!body.length && (customer?.weightKg || customer?.heightCm)) {
    body.push({
      week: "Profile",
      weight: customer?.weightKg || 0,
      height: customer?.heightCm || 0,
    });
  }

  return NextResponse.json({
    weeklyXP,
    totalXP,
    avgScore,
    weightTrend,
    level: Math.floor(totalXP / 100) + 1,
    streak: attendanceKeys.size,
    weekly,
    body,
  });
}
