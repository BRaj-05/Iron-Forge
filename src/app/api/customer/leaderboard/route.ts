import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/prisma/client";
import { getSessionFromRequest } from "@/lib/session";

function xpFor(customerId: string, attendance: Set<string>, workouts: Set<string>, diets: Set<string>, metrics: Set<string>) {
  return (
    [...attendance].filter((key) => key.startsWith(customerId)).length * 25 +
    [...workouts].filter((key) => key.startsWith(customerId)).length * 35 +
    [...diets].filter((key) => key.startsWith(customerId)).length * 25 +
    [...metrics].filter((key) => key.startsWith(customerId)).length * 15
  );
}

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER", isActive: true },
    select: { id: true, name: true, email: true, photoUrl: true, assignedTrainerId: true },
  });
  const ids = customers.map((customer) => customer.id);

  const [attendanceRows, workoutRows, dietRows, metricRows] = await Promise.all([
    prisma.attendance.findMany({ where: { customerId: { in: ids } }, select: { customerId: true, logDate: true } }),
    prisma.dailyWorkoutLog.findMany({ where: { customerId: { in: ids }, completed: true }, select: { customerId: true, logDate: true } }),
    prisma.dailyDietLog.findMany({ where: { customerId: { in: ids }, completed: true }, select: { customerId: true, logDate: true } }),
    prisma.bodyMetricLog.findMany({ where: { customerId: { in: ids } }, select: { customerId: true, logDate: true } }),
  ]);

  const attendance = new Set(attendanceRows.map((row) => `${row.customerId}:${row.logDate}`));
  const workouts = new Set(workoutRows.map((row) => `${row.customerId}:${row.logDate}`));
  const diets = new Set(dietRows.map((row) => `${row.customerId}:${row.logDate}`));
  const metrics = new Set(metricRows.map((row) => `${row.customerId}:${row.logDate}`));

  const rows = customers
    .map((customer) => {
      const xp = xpFor(customer.id, attendance, workouts, diets, metrics);
      return {
        id: customer.id,
        xp,
        level: Math.floor(xp / 100) + 1,
        streak: attendanceRows.filter((row) => row.customerId === customer.id).length,
        user: customer,
      };
    })
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 25);

  return NextResponse.json(rows);
}
