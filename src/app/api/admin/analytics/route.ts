import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Todo from "@/models/Todo";
import UserProgress from "@/models/UserProgress";

import Attendance from "@/models/Attendance";
import Payment from "@/models/Payment";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();

  const attendanceCount = await Attendance.countDocuments();

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const weeklyAttendance = await Attendance.countDocuments({
    checkInTime: { $gte: last7Days },
  });

  const totalUsers = await User.countDocuments({ role: "CUSTOMER" });
  const totalTasks = await Todo.countDocuments();
  const completedTasks = await Todo.countDocuments({ completed: true });

  const xpAgg = await UserProgress.aggregate([
    { $group: { _id: null, totalXP: { $sum: "$xp" } } }
  ]);

  const totalXP = xpAgg[0]?.totalXP || 0;

 const revenueTrendAgg = await Payment.aggregate([
  {
    $group: {
      _id: {
        $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" },
      },
      total: { $sum: "$amount" },
    },
  },
  { $sort: { _id: 1 } },
  { $limit: 7 },
]);

const revenueTrend = revenueTrendAgg.map(r => ({
  day: r._id,
  value: r.total,
}));

const memberGrowthAgg = await User.aggregate([
  { $match: { role: "CUSTOMER" } },
  {
    $group: {
      _id: {
        $dateToString: { format: "%Y-%m", date: "$createdAt" },
      },
      count: { $sum: 1 },
    },
  },
  { $sort: { _id: 1 } },
]);

const memberGrowth = memberGrowthAgg.map(m => ({
  month: m._id,
  value: m.count,
}));
 
const inactiveMembers = await Attendance.aggregate([
  {
    $group: {
      _id: "$userId",
      lastCheckIn: { $max: "$checkInTime" },
    },
  },
]);

// last7
const last7 = new Date();
last7.setDate(last7.getDate() - 7);

const attendanceTrend = await Attendance.aggregate([
  {
    $match: {
      checkInTime: { $gte: last7 },
    },
  },
  {
    $group: {
      _id: {
        $dateToString: { format: "%Y-%m-%d", date: "$checkInTime" },
      },
      count: { $sum: 1 },
    },
  },
  { $sort: { _id: 1 } },
]);

const totalRevenueAgg = await Payment.aggregate([
  { $group: { _id: null, total: { $sum: "$amount" } } },
]);

const revenue = totalRevenueAgg[0]?.total || 0;


const formattedAttendanceTrend = attendanceTrend.map(a => ({
  day: a._id,
  value: a.count,
}));

const risky = inactiveMembers.filter((m) => {
  const diff =
    (Date.now() - new Date(m.lastCheckIn).getTime()) /
    (1000 * 60 * 60 * 24);

  return diff > 14;
}).length;
  const topUsers = await UserProgress.find()
    .sort({ xp: -1 })
    .limit(5)
    .populate("userId", "name");

 return NextResponse.json({
  totalUsers,
  totalTasks,
  completedTasks,
  totalXP,
  revenue, // ✅ real revenue now
  streak: 12,
  revenueTrend,
  memberGrowth,
  attendanceCount,
  weeklyAttendance,
  attendanceTrend: formattedAttendanceTrend,
  renewalRiskMembers: risky,
  topUsers: topUsers.map(u => ({
    name: u.userId?.name || "User",
    xp: u.xp
  })),
});
}
