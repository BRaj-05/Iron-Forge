// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import UserProgress from "@/models/UserProgress";
// import User from "@/models/User"; // IMPORTANT: force register model

// export async function GET() {
//   await connectDB();

//   const leaderboard = await UserProgress.find()
//     .sort({ xp: -1 })
//     .limit(10)
//     .populate({
//       path: "userId",
//       select: "fullName email role",
//       match: { role: "CUSTOMER" }, // 👈 THIS removes admin from leaderboard
//     });

//   // Remove null results (if admin was filtered)
//   const filtered = leaderboard.filter((item) => item.userId);

//   return NextResponse.json(filtered);
// }
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import UserProgress from "@/models/UserProgress";
import User from "@/models/User"; // IMPORTANT

type LeaderboardEntry = {
  userId?: {
    role?: string;
  };
};

void User;

export async function GET() {
  try {
    await connectDB();

    const leaderboard = await UserProgress.find()
      .sort({ xp: -1 })
      .limit(10)
      .populate("userId", "name email role");

    // Remove admins from leaderboard
    const filtered = leaderboard.filter(
      (entry: LeaderboardEntry) => entry.userId?.role === "CUSTOMER"
    );

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
