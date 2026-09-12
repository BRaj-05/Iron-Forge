import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mailer";

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    if (!isEmailValid(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(24).toString("hex");

    await User.create({
      name: fullName,
      email: normalizedEmail,
      password: hashedPassword,
      role: "CUSTOMER",
      emailVerified: false,
      verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    const verificationUrl = `${appUrl}/api/auth/verify-email?token=${verificationToken}`;

    console.log(
      "[Signup] Verification link:",
      verificationUrl,
    );

    await sendVerificationEmail({
      to: normalizedEmail,
      name: fullName,
      verificationUrl,
    });

    return NextResponse.json({
      message: "Signup successful. Verify your email to continue.",
      verificationUrl:
        process.env.NODE_ENV === "production" ? undefined : verificationUrl,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
