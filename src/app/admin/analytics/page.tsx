"use client";

import { motion } from "framer-motion";
import { theme } from "@/lib/theme";

export default function AnalyticsPage() {
  const stats = [
    { label: "Total Members", value: 248, color: theme.green },
    { label: "Monthly Revenue", value: "₹84,000", color: theme.accent },
    { label: "Retention Rate", value: "82%", color: theme.gold },
    { label: "Avg Attendance", value: "76%", color: theme.green },
  ];

  const monthlyData = [62, 74, 68, 82, 91, 84];

  return (
    <div>
      <h1 style={{
        fontFamily: "'Bebas Neue', cursive",
        fontSize: 42,
        color: theme.textPrimary,
        marginBottom: 28,
        letterSpacing: 2
      }}>
        ADMIN ANALYTICS 📊
      </h1>

      {/* Top Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 40
      }}>
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: theme.surface,
              padding: 24,
              borderRadius: 16,
              border: `1px solid ${theme.border}`
            }}
          >
            <p style={{ color: theme.textSecondary, fontSize: 12 }}>
              {stat.label}
            </p>
            <h2 style={{
              color: stat.color,
              fontSize: 28,
              marginTop: 6
            }}>
              {stat.value}
            </h2>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div style={{
        background: theme.surface,
        padding: 24,
        borderRadius: 16,
        border: `1px solid ${theme.border}`
      }}>
        <p style={{
          color: theme.textSecondary,
          marginBottom: 20,
          fontSize: 12
        }}>
          REVENUE GROWTH (6 MONTHS)
        </p>

        <div style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 16,
          height: 200
        }}>
          {monthlyData.map((value, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${value}%` }}
              transition={{ delay: i * 0.1 }}
              style={{
                flex: 1,
                background: theme.gradient,
                borderRadius: "6px 6px 0 0"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}