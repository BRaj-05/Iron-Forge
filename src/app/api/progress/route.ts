import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import UserProgress from "@/models/UserProgress";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    let progress = await UserProgress.findOne({ userId: decoded.id });

    if (!progress) {
      progress = await UserProgress.create({ userId: decoded.id });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Progress error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
