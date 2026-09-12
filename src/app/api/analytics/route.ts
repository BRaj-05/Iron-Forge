import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Todo from "@/models/Todo";
import UserProgress from "@/models/UserProgress";

export async function GET() {
  await connectDB();

  const totalUsers = await User.countDocuments();
  const totalTasks = await Todo.countDocuments();
  const completedTasks = await Todo.countDocuments({ completed: true });

  const completionRate =
    totalTasks > 0
      ? ((completedTasks / totalTasks) * 100).toFixed(1)
      : 0;

  const xpData = await UserProgress.aggregate([
    {
      $group: {
        _id: "$level",
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const streakData = await UserProgress.aggregate([
    {
      $group: {
        _id: "$streak",
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return NextResponse.json({
    totalUsers,
    totalTasks,
    completedTasks,
    completionRate,
    xpData,
    streakData,
  });
}