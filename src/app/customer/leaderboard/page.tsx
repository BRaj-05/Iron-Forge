"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface User {
  _id: string;
  xp: number;
  level: number;
  streak: number;
  userId: {
    fullName?: string;
    name?: string;
    email: string;
  };
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div style={{ padding: 32 }}>Loading leaderboard...</div>;
  }

  if (users.length === 0) {
    return <div style={{ padding: 32 }}>No users found</div>;
  }

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div style={{ padding: 32 }}>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32 }}
      >
        <p style={{
          color: "#f97316",
          fontSize: 11,
          letterSpacing: 4,
        }}>
          LIVE RANKINGS
        </p>

        <h1 style={{
          fontSize: 48,
          fontFamily: "'Bebas Neue', cursive",
        }}>
          CHAMPION BOARD 🏆
        </h1>
      </motion.div>

      {/* TOP 3 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 16,
        marginBottom: 40,
      }}>
        {top3.map((user, i) => {
          const styles = [
            { color: "#fbbf24", badge: "🥇" },
            { color: "#94a3b8", badge: "🥈" },
            { color: "#cd7f32", badge: "🥉" },
          ][i];

          return (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              style={{
                background: "#0f172a",
                borderRadius: 18,
                padding: 20,
                textAlign: "center",
                border: `2px solid ${styles.color}`,
                boxShadow: `0 0 20px ${styles.color}40`,
              }}
            >
              <div style={{ fontSize: 40 }}>{styles.badge}</div>

              <h3 style={{ marginTop: 10 }}>
                {user.userId?.fullName || user.userId?.name || "User"}
              </h3>

              <p style={{ color: "#94a3b8", fontSize: 12 }}>
                Level {user.level} • 🔥 {user.streak}
              </p>

              <h2 style={{
                color: styles.color,
                fontSize: 28,
                marginTop: 10,
              }}>
                {user.xp} XP
              </h2>
            </motion.div>
          );
        })}
      </div>

      {/* REST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rest.map((user, i) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 6 }}
            style={{
              background: "#0f172a",
              border: "1px solid #1f2937",
              borderRadius: 14,
              padding: "18px 24px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p>
                #{i + 4}{" "}
                {user.userId?.fullName || user.userId?.name || "User"}
              </p>

              <p style={{ color: "#94a3b8", fontSize: 12 }}>
                Level {user.level} • 🔥 {user.streak} days
              </p>
            </div>

            <div style={{ color: "#f97316", fontSize: 22 }}>
              {user.xp} XP
            </div>
          </motion.div>
        ))}
      </div>

      {/* MOTIVATION */}
      <div style={{
        marginTop: 40,
        padding: 20,
        borderRadius: 16,
        background: "rgba(249,115,22,0.08)",
        border: "1px solid rgba(249,115,22,0.2)",
        textAlign: "center",
      }}>
        🚀 Complete workouts daily to climb the leaderboard!
      </div>

    </div>
  );
}