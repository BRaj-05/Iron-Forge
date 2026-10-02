import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/prisma/client";
import { requireRole } from "@/lib/session";

export async function GET(request: Request) {
  const auth = await requireRole(request, ["OWNER"]);
  if (auth.response) return auth.response;

  const [members, progress, subscriptions] = await Promise.all([
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: { id: true, name: true, email: true, createdAt: true, isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customerProgress.findMany(),
    prisma.subscription.findMany({ orderBy: { endDate: "desc" } }),
  ]);

  const progressByCustomer = new Map(progress.map((item) => [item.customerId, item]));
  const subscriptionByCustomer = new Map<string, (typeof subscriptions)[number]>();
  subscriptions.forEach((item) => {
    if (!subscriptionByCustomer.has(item.userId)) subscriptionByCustomer.set(item.userId, item);
  });

  return NextResponse.json({
    totalMembers: members.length,
    members: members.map((member) => {
      const memberProgress = progressByCustomer.get(member.id);
      return {
        id: member.id,
        name: member.name,
        email: member.email,
        level: memberProgress?.level || 1,
        xp: memberProgress?.xp || 0,
        streak: memberProgress?.streak || 0,
        status: member.isActive
          ? subscriptionByCustomer.get(member.id)?.status || "NO_PLAN"
          : "INACTIVE",
        joined: member.createdAt,
      };
    }),
  });
}
