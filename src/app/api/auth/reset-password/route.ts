import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { token, password } = await req.json();

    if (!token || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Invalid token or password." },
        { status: 400 },
      );
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    if (!user.emailVerified) {
      user.emailVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
    }

    await user.save();

    return NextResponse.json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
