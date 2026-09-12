import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { getSubscriptionStatus } from "@/lib/subscriptions";

const SubscriptionSchema = z.object({
  userId: z.string(),
  planId: z.string(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  autoRenew: z.boolean().default(false),
});

export async function POST(request: Request) {
  const auth = await requireRole(request, ["OWNER"]);
  if (auth.response) return auth.response;

  const parsed = SubscriptionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid subscription payload." }, { status: 400 });

  const plan = await prisma.membershipPlan.findUnique({ where: { id: parsed.data.planId } });
  if (!plan) return NextResponse.json({ error: "Plan not found." }, { status: 404 });

  const startDate = parsed.data.startDate ? new Date(parsed.data.startDate) : new Date();
  const endDate = parsed.data.endDate ? new Date(parsed.data.endDate) : new Date(startDate);
  if (!parsed.data.endDate) endDate.setDate(endDate.getDate() + plan.durationDays);

  const subscription = await prisma.subscription.create({
    data: {
      userId: parsed.data.userId,
      planId: parsed.data.planId,
      startDate,
      endDate,
      autoRenew: parsed.data.autoRenew,
      status: getSubscriptionStatus(endDate).status,
    },
  });

  await prisma.payment.create({
    data: {
      userId: parsed.data.userId,
      amount: plan.price,
      method: "Manual admin entry",
      status: "PAID",
      subscriptionId: subscription.id,
    },
  });

  return NextResponse.json({ subscription }, { status: 201 });
}
