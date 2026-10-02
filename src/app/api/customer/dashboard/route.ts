import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/infrastructure/prisma/client";
import { dateKey } from "@/lib/daily";
import { getSessionFromRequest, requireRole } from "@/lib/session";
import { getSubscriptionStatus, getUserWithSubscription } from "@/lib/subscriptions";

const optionalNullableNumber = z.preprocess(
  (value) => (value === "" ? null : value),
  z.coerce.number().positive().nullable().optional(),
);

const ProfileSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().nullable().optional(),
  address: z.string().trim().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  gender: z.string().trim().nullable().optional(),
  heightCm: optionalNullableNumber,
  weightKg: optionalNullableNumber,
  emergencyContact: z.string().trim().nullable().optional(),
});

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session || session.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await getUserWithSubscription(session.userId);
  if (!result) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const today = dateKey();
  const [attendance, payments, notifications, trainer, workout, diet, metric] = await Promise.all([
    prisma.attendance.findMany({ where: { customerId: session.userId }, orderBy: { checkIn: "desc" }, take: 30 }),
    prisma.payment.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.notification.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" }, take: 10 }),
    result.user.assignedTrainerId
      ? prisma.user.findUnique({ where: { id: result.user.assignedTrainerId }, select: { id: true, name: true, email: true, photoUrl: true, specialization: true } })
      : null,
    prisma.dailyWorkoutLog.findUnique({ where: { customerId_logDate: { customerId: session.userId, logDate: today } } }),
    prisma.dailyDietLog.findUnique({ where: { customerId_logDate: { customerId: session.userId, logDate: today } } }),
    prisma.bodyMetricLog.findUnique({ where: { customerId_logDate: { customerId: session.userId, logDate: today } } }),
  ]);

  const expiry = result.subscription ? getSubscriptionStatus(result.subscription.endDate) : null;

  return NextResponse.json({
    user: result.user,
    subscription: result.subscription ? { ...result.subscription, daysRemaining: expiry?.daysRemaining } : null,
    plan: result.plan,
    trainer,
    attendance,
    payments,
    notifications,
    daily: { logDate: today, workout, diet, metric },
  });
}

export async function PATCH(request: Request) {
  const auth = await requireRole(request, ["CUSTOMER", "TRAINER"]);
  if (auth.response || !auth.session) return auth.response;

  const parsed = ProfileSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid profile payload." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: auth.session.userId },
    data: {
      ...parsed.data,
      dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : undefined,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      photoUrl: true,
      address: true,
      dateOfBirth: true,
      gender: true,
      heightCm: true,
      weightKg: true,
      emergencyContact: true,
    },
  });

  return NextResponse.json({ user });
}
