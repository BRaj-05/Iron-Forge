import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/prisma/client";
import { dateKey } from "@/lib/daily";
import { requireRole } from "@/lib/session";

export async function GET(request: Request) {
  const auth = await requireRole(request, ["TRAINER"]);
  if (auth.response || !auth.session) return auth.response;

  const trainer = await prisma.user.findUnique({ where: { id: auth.session.userId } });
  if (!trainer) return NextResponse.json({ error: "Trainer not found." }, { status: 404 });

  const customers = trainer.assignedCustomerIds.length
    ? await prisma.user.findMany({
        where: { id: { in: trainer.assignedCustomerIds }, role: "CUSTOMER" },
        select: {
          id: true,
          name: true,
          photoUrl: true,
          dateOfBirth: true,
          gender: true,
          heightCm: true,
          weightKg: true,
        },
      })
    : [];
  const today = dateKey();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = dateKey(yesterdayDate);

  const [workouts, diets, metrics] = customers.length
    ? await Promise.all([
        prisma.dailyWorkoutLog.findMany({
          where: { customerId: { in: customers.map((customer) => customer.id) }, logDate: { in: [today, yesterday] } },
          orderBy: { logDate: "desc" },
        }),
        prisma.dailyDietLog.findMany({
          where: { customerId: { in: customers.map((customer) => customer.id) }, logDate: { in: [today, yesterday] } },
          orderBy: { logDate: "desc" },
        }),
        prisma.bodyMetricLog.findMany({
          where: { customerId: { in: customers.map((customer) => customer.id) } },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
      ])
    : [[], [], []];
  const attendance = await prisma.attendance.findMany({
    where: { trainerId: trainer.id },
    orderBy: { checkIn: "desc" },
    take: 50,
  });

  return NextResponse.json({ trainer, customers, attendance, workouts, diets, metrics });
}
