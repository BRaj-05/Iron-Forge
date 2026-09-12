import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import UserProgress from "@/models/UserProgress";

export async function GET() {
  try {
    await connectDB();

    const members = await User.find({ role: "CUSTOMER" })
      .select("name email createdAt")
      .lean();

    const progress = await UserProgress.find().lean();

  // ⚡ Create map (O(n))
const progressMap = new Map(
  progress.map(p => [p.userId.toString(), p])
);

// ⚡ Fast lookup (O(1))
const enrichedMembers = members.map(member => {
  const p = progressMap.get(member._id.toString());

  return {
    id: member._id,
    name: member.name,
    email: member.email,
    level: p?.level || 1,
    xp: p?.xp || 0,
    streak: p?.streak || 0,
    status: p?.membershipStatus || "ACTIVE",
    joined: member.createdAt,
  };
});

    return NextResponse.json({
      totalMembers: enrichedMembers.length,
      members: enrichedMembers,
    });

  } catch {
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
