import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/infrastructure/prisma/client";
import { sendPasswordResetEmail } from "@/lib/mailer";

const ForgotPasswordSchema = z.object({ email: z.string().email() });
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const parsed = ForgotPasswordSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const resetUrl = `${APP_URL}/reset-password/${token}`;

      await prisma.user.update({
        where: { id: user.id },
        data: { resetTokenHash, resetTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000) },
      });
      await sendPasswordResetEmail({ to: email, resetUrl });
    }

    return NextResponse.json({ message: "If the account exists, a reset link was sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
