import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";
import Membership from "@/models/Membership";
import Payment from "@/models/Payment";

type TokenPayload = {
  id: string;
  email?: string;
};

const planFallbacks: Record<string, { name: string; duration: number; price: number }> = {
  ELITE: { name: "Elite", duration: 30, price: 2499 },
  PRO: { name: "Pro", duration: 90, price: 5999 },
  SELECT: { name: "Select", duration: 365, price: 14999 },
};

export async function POST(req: Request) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyAccessToken(token) as TokenPayload;
    const body = await req.json();
    const planKey = String(body.plan || "ELITE").toUpperCase();
    const fallback = planFallbacks[planKey] || planFallbacks.ELITE;

    await connectDB();

    let membership = await Membership.findOne({ name: fallback.name });
    if (!membership) {
      membership = await Membership.create({
        name: fallback.name,
        duration: fallback.duration,
        price: fallback.price,
        features: "Gym access, member dashboard, workout tracking, and trainer support.",
      });
    }

    const provider = process.env.STRIPE_SECRET_KEY ? "STRIPE" : "MOCK";
    const payment = await Payment.create({
      userId: decoded.id,
      membershipId: membership._id,
      amount: membership.price,
      currency: "INR",
      provider,
      paymentMethod: provider === "STRIPE" ? "STRIPE_CHECKOUT" : "MOCK_CHECKOUT",
      paymentStatus: "PENDING",
      status: "PENDING",
      transactionId: `IF-${Date.now()}`,
      planName: membership.name,
      metadata: {
        userId: decoded.id,
        email: decoded.email,
        planKey,
        note:
          provider === "MOCK"
            ? "Set STRIPE_SECRET_KEY and Stripe Prices later to create real Checkout Sessions."
            : "Stripe key detected. Checkout Session wiring is prepared for the next gateway step.",
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const checkoutUrl =
      provider === "MOCK"
        ? `${appUrl}/customer/payments?mockPaymentId=${payment._id}`
        : `${appUrl}/customer/payments?provider=stripe-next-step&paymentId=${payment._id}`;

    payment.checkoutUrl = checkoutUrl;
    await payment.save();

    return NextResponse.json({
      provider,
      checkoutUrl,
      paymentId: payment._id,
      amount: payment.amount,
      currency: payment.currency,
      planName: payment.planName,
    });
  } catch (error) {
    console.error("Create checkout error:", error);
    return NextResponse.json(
      { error: "Could not create checkout." },
      { status: 500 },
    );
  }
}
