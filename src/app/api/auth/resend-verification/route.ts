import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/mailer";

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email || !isEmailValid(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+verificationToken +verificationTokenExpiry",
    );

    if (!user) {
      return NextResponse.json(
        { error: "No account found for this email." },
        { status: 404 },
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "Email is already verified." });
    }

    const token = crypto.randomBytes(24).toString("hex");
    user.verificationToken = token;
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    const verificationUrl = `${appUrl}/api/auth/verify-email?token=${token}`;

    console.log("[Auth] Verification link:", verificationUrl);

    await sendVerificationEmail({
      to: normalizedEmail,
      name: user.name,
      verificationUrl,
    });

    return NextResponse.json({
      message: "Verification link generated.",
      verificationUrl,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
