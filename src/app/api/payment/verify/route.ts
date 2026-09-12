import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";
import Membership from "@/models/Membership";
import Payment from "@/models/Payment";
import Subscription from "@/models/Subscription";

type TokenPayload = {
  id: string;
};

export async function POST(req: Request) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyAccessToken(token) as TokenPayload;
    const { paymentId } = await req.json();

    await connectDB();
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json({ error: "Payment not found." }, { status: 404 });
    }

    payment.status = "SUCCESS";
    payment.paymentStatus = "SUCCESS";
    payment.providerPaymentId = payment.providerPaymentId || `MOCK-PAID-${Date.now()}`;
    await payment.save();

    const membership = await Membership.findById(payment.membershipId);
    const duration = membership?.duration || 30;
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);

    const subscription = await Subscription.create({
      userId: decoded.id,
      customerId: payment.customerId,
      membershipId: payment.membershipId,
      startDate,
      endDate,
      status: "ACTIVE",
      paymentId: payment._id,
      provider: payment.provider,
      externalSubscriptionId: `IF-SUB-${decoded.id}-${Date.now()}`,
      autoRenew: false,
    });

    return NextResponse.json({
      payment,
      subscription,
      message: "Payment verified and subscription activated.",
    });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json(
      { error: "Could not verify payment." },
      { status: 500 },
    );
  }
}
