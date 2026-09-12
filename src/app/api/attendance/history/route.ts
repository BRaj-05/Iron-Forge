import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";
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

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const attendance = await Attendance.find({
      userId: decoded.id,
      checkInTime: { $gte: last30Days },
    }).lean();

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Attendance history error:", error);

    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 },
    );
  }
}
