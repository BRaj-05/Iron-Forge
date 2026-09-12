import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Attendance from "../../../../models/Attendance";
import UserProgress from "../../../../models/UserProgress";
import { getTokenFromRequest, verifyAccessToken } from "../../../../lib/auth";

/* ================= HELPER ================= */

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/* ================= POST ================= */

export async function POST(req: Request) {
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

    const today = new Date();

    /* ================= PREVENT DOUBLE CHECK-IN ================= */

    const existing = await Attendance.findOne({
      userId: decoded.id,
    }).sort({ createdAt: -1 });

    if (existing && isSameDay(existing.checkInTime, today)) {
      return NextResponse.json(
        { error: "Already checked in today" },
        { status: 400 },
      );
    }

    /* ================= CREATE ATTENDANCE ================= */

    await Attendance.create({
      userId: decoded.id,
      checkInTime: today,
    });

    /* ================= UPDATE PROGRESS ================= */

    let progress = await UserProgress.findOne({
      userId: decoded.id,
    });

    if (!progress) {
      progress = await UserProgress.create({
        userId: decoded.id,
        xp: 0,
        level: 1,
        streak: 0,
      });
    }

    // 🎯 Add XP
    progress.xp += 10;

    // 🎯 Level system
    progress.level = Math.floor(progress.xp / 100) + 1;

    /* ================= STREAK LOGIC (FIXED) ================= */

    if (!progress.lastCompletedDate) {
      progress.streak = 1;
    } else {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (isSameDay(progress.lastCompletedDate, yesterday)) {
        progress.streak += 1;
      } else if (!isSameDay(progress.lastCompletedDate, today)) {
        progress.streak = 1;
      }
    }

    progress.lastCompletedDate = today;

    await progress.save();

    /* ================= RESPONSE ================= */

    return NextResponse.json({
      message: "Check-in successful",
      xp: progress.xp,
      streak: progress.streak,
      level: progress.level,
    });
  } catch (error) {
    console.error("Check-in error:", error);

    return NextResponse.json({ error: "Failed to check-in" }, { status: 500 });
  }
}
