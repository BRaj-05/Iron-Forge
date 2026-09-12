"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { ReactNode } from "react";

type AdminAnalytics = {
  attendanceCount?: number;
  attendanceTrend?: Array<Record<string, string | number>>;
  revenue?: number;
  totalXP?: number;
  totalTasks?: number;
  totalUsers?: number;
  streak?: number;
  revenueTrend?: Array<Record<string, string | number>>;
  memberGrowth?: Array<Record<string, string | number>>;
  topUsers?: Array<Record<string, string | number>>;
  weeklyAttendance?: number;
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  /* ================= REAL-TIME FETCH ================= */

  async function fetchAnalytics() {
    const res = await fetch("/api/admin/analytics");
    if (!res.ok) return;
    const data = await res.json();
    setAnalytics(data);
  }

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ================= GAMIFICATION ================= */

  useEffect(() => {
    if (!analytics) return;

    const newXP = analytics.totalXP || 0;
    setXp(newXP);

    const newLevel = Math.floor(newXP / 100) + 1;

    if (newLevel > level) {
      setLevel(newLevel);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [analytics]);

  if (!analytics) return <div style={{ padding: 32 }}>Loading...</div>;

  const revenueData = analytics.revenueTrend;
  const memberGrowth = analytics.memberGrowth;
  const leaderboard = analytics.topUsers;

  const progressPercent = (xp % 100);

  return (
    <div style={{ padding: 32 }}>

      {showConfetti && <Confetti />}

      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontSize: 48,
          fontFamily: "'Bebas Neue', cursive",
          marginBottom: 24,
        }}
      >
        ADMIN CONTROL CENTER 👑
      </motion.h1>

      {/* LEVEL PROGRESS RING */}
      <div style={{ display: "flex", gap: 40, marginBottom: 40 }}>

        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: `conic-gradient(#f97316 ${progressPercent}%, #1f2937 ${progressPercent}%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "#0f172a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}>
            <h2 style={{ fontSize: 28 }}>LVL {level}</h2>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>
              {xp % 100}/100 XP
            </p>
          </div>
        </motion.div>

        {/* STREAK FIRE */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          style={{
            fontSize: 60,
          }}
        >
          🔥 {analytics.streak}
        </motion.div>

      </div>

   {/* REAL-TIME STATS */}
<div style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
  marginBottom: 40,
}}>
  <StatCard title="Members" value={analytics.totalUsers} />
  <StatCard title="Workouts" value={analytics.totalTasks} />
  <StatCard title="Revenue" value={`₹${analytics.revenue}`} />

  {/* 🔥 ADD THESE TWO HERE */}
  <StatCard
    title="Total Check-ins"
    value={analytics.attendanceCount || 0}
  />
  <StatCard
    title="Weekly Check-ins"
    value={analytics.weeklyAttendance || 0}
  />
</div>

      {/* REVENUE CHART */}
      <PremiumChart title="Revenue Trend 📈">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid stroke="#1f2937" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#f97316"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </PremiumChart>

      {/* MEMBER GROWTH */}
      <PremiumChart title="Member Growth 📊">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={memberGrowth}>
            <CartesianGrid stroke="#1f2937" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              fill="#22c55e33"
            />
          </AreaChart>
        </ResponsiveContainer>
      </PremiumChart>
{/*  */}
{/* ATTENDANCE TREND */}
<PremiumChart title="Attendance Trend 🔥">
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={analytics.attendanceTrend}>
      <CartesianGrid stroke="#1f2937" />
      <XAxis dataKey="day" stroke="#94a3b8" />
      <YAxis stroke="#94a3b8" />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#ef4444"
        strokeWidth={3}
      />
    </LineChart>
  </ResponsiveContainer>
</PremiumChart>


      {/* LEADERBOARD */}
      <PremiumChart title="Top Performers 🏆">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={leaderboard}>
            <CartesianGrid stroke="#1f2937" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="xp" fill="#eab308" />
          </BarChart>
        </ResponsiveContainer>
      </PremiumChart>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value }: { title: string; value: ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      style={{
        background: "linear-gradient(145deg,#0f172a,#1e293b)",
        padding: 24,
        borderRadius: 18,
        border: "1px solid #1f2937",
      }}
    >
      <p style={{ color: "#94a3b8" }}>{title}</p>
      <h2 style={{
        fontSize: 32,
        fontFamily: "'Bebas Neue', cursive",
      }}>
        {value}
      </h2>
    </motion.div>
  );
}

function PremiumChart({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: "#0f172a",
        padding: 24,
        borderRadius: 20,
        border: "1px solid #1f2937",
        marginBottom: 40,
      }}
    >
      <h2 style={{ marginBottom: 20 }}>{title}</h2>
      {children}
    </motion.div>
    
  );
}

// "use client";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// interface Props {
//   completed: number;
//   total: number;
// }

// export default function CompletionChart({ completed, total }: Props) {
//   const data = [
//     { name: "Completed", value: completed },
//     { name: "Remaining", value: total - completed },
//   ];

//   return (
//     <div style={{ height: 300, marginTop: 40 }}>
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={data}>
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Line
//             type="monotone"
//             dataKey="value"
//             stroke="#f97316"
//             strokeWidth={3}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }
