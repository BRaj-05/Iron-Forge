import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/infrastructure/prisma/client";
import { requireRole } from "@/lib/session";

const CheckoutSchema = z.object({
  plan: z.string().trim().min(1),
});

const fallbackPlans: Record<string, { name: string; durationDays: number; price: number; features: string[] }> = {
  ELITE: { name: "Elite", durationDays: 30, price: 2499, features: ["Gym access", "Workout tracking", "Trainer support"] },
  PRO: { name: "Pro", durationDays: 90, price: 5999, features: ["Gym access", "Workout tracking", "Trainer support"] },
  SELECT: { name: "Select", durationDays: 365, price: 14999, features: ["Annual access", "Workout tracking", "Trainer support"] },
};

function isObjectId(value: string) {
  return /^[a-f\d]{24}$/i.test(value);
}

export async function POST(request: Request) {
  const auth = await requireRole(request, ["CUSTOMER"]);
  if (auth.response || !auth.session) return auth.response;

  const parsed = CheckoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Plan is required." }, { status: 400 });

  const planKey = parsed.data.plan.toUpperCase();
  const fallback = fallbackPlans[planKey] || fallbackPlans.ELITE;
  let plan = isObjectId(parsed.data.plan)
    ? await prisma.membershipPlan.findUnique({ where: { id: parsed.data.plan } })
    : null;

  plan ??= await prisma.membershipPlan.findFirst({ where: { name: fallback.name } });

  if (!plan) {
    plan = await prisma.membershipPlan.create({ data: fallback });
  }

  const payment = await prisma.payment.create({
    data: {
      userId: auth.session.userId,
      amount: plan.price,
      method: process.env.STRIPE_SECRET_KEY ? "STRIPE_CHECKOUT" : "MOCK_CHECKOUT",
      status: "PENDING",
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const checkoutUrl = `${appUrl}/customer/payments?mockPaymentId=${payment.id}&planId=${plan.id}`;

  return NextResponse.json({
    provider: process.env.STRIPE_SECRET_KEY ? "STRIPE" : "MOCK",
    checkoutUrl,
    paymentId: payment.id,
    planId: plan.id,
    amount: payment.amount,
    currency: "INR",
    planName: plan.name,
  });
}
