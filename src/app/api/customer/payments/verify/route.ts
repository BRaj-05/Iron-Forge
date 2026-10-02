import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/infrastructure/prisma/client";
import { requireRole } from "@/lib/session";
import { getSubscriptionStatus } from "@/lib/subscriptions";

const VerifySchema = z.object({
  paymentId: z.string(),
  planId: z.string(),
});

export async function POST(request: Request) {
  const auth = await requireRole(request, ["CUSTOMER"]);
  if (auth.response || !auth.session) return auth.response;

  const parsed = VerifySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Payment and plan are required." }, { status: 400 });

  const [payment, plan] = await Promise.all([
    prisma.payment.findUnique({ where: { id: parsed.data.paymentId } }),
    prisma.membershipPlan.findUnique({ where: { id: parsed.data.planId } }),
  ]);

  if (!payment || payment.userId !== auth.session.userId) {
    return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  }
  if (!plan) return NextResponse.json({ error: "Plan not found." }, { status: 404 });

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.durationDays);

  const subscription = await prisma.subscription.create({
    data: {
      userId: auth.session.userId,
      planId: plan.id,
      startDate,
      endDate,
      status: getSubscriptionStatus(endDate).status,
    },
  });

  const paid = await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "PAID", subscriptionId: subscription.id },
  });

  return NextResponse.json({
    payment: paid,
    subscription,
    message: "Payment verified and subscription activated.",
  });
}
