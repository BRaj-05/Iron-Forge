import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/prisma/client";
import { requireRole } from "@/lib/session";

export async function GET(request: Request) {
  const auth = await requireRole(request, ["OWNER"]);
  if (auth.response) return auth.response;

  const [users, plans, subscriptions, payments, attendance, notifications, supportRequests] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.membershipPlan.findMany({ orderBy: { name: "asc" } }),
    prisma.subscription.findMany({ orderBy: { endDate: "asc" } }),
    prisma.payment.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.attendance.findMany({ orderBy: { checkIn: "desc" }, take: 100 }),
    prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.supportRequest.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);

  return NextResponse.json({
    users,
    plans,
    subscriptions,
    payments,
    attendance,
    notifications,
    supportRequests,
    expiringMembers: subscriptions.filter((item) => item.status === "EXPIRING_SOON" || item.status === "EXPIRED"),
  });
}
