import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/mailer";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();
    const normalizedEmail =
      typeof email === "string" ? email.toLowerCase().trim() : "";

    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      const token = crypto.randomBytes(24).toString("hex");
      const resetUrl = `${APP_URL}/reset-password/${token}`;

      user.resetToken = token;
      user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      console.log("[ForgotPassword] Reset link:", resetUrl);

      await sendPasswordResetEmail({
        to: normalizedEmail,
        resetUrl,
      });
    }

    return NextResponse.json({
      message: "If the account exists, a reset link was sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
