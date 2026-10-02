"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CountUp } from "@/components/motion/CountUp";
import Card from "@/components/ui/Card";
import { DEFAULT_AVATAR_URL } from "@/lib/media";
import { theme } from "@/lib/theme";
import { apiRoutes } from "@/config/api-routes";

type Entry = {
  id: string;
  xp: number;
  level: number;
  streak: number;
  user: { id: string; name: string; email: string; photoUrl?: string | null };
};

export default function LeaderboardPage() {
  const [users, setUsers] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiRoutes.customer.leaderboard, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.page}>Loading leaderboard...</div>;

  return (
    <div style={styles.page}>
      <motion.header initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
        <Card style={styles.hero}>
        <p style={styles.eyebrow}>LIVE RANKINGS</p>
        <h1 style={styles.title}>Consistency leaderboard</h1>
        <p style={styles.copy}>XP is calculated from attendance, completed workouts, diet logs, and body tracking.</p>
        </Card>
      </motion.header>

      <section style={styles.board}>
        {users.length ? users.map((entry, index) => (
          <motion.article key={entry.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
            <Card accent={medalColor(index)} style={styles.row}>
            <strong style={{ ...styles.rank, background: medalColor(index), color: index < 3 ? "#0A0A0F" : theme.gold }}>
              {index < 3 ? ["1", "2", "3"][index] : `#${index + 1}`}
            </strong>
            <Image src={entry.user.photoUrl || DEFAULT_AVATAR_URL} alt="" width={54} height={54} unoptimized style={styles.avatar} />
            <div>
              <h2 style={styles.name}>{entry.user.name}</h2>
              <p style={styles.muted}>Level {entry.level} | {entry.streak} check-ins</p>
            </div>
            <strong style={styles.xp}><CountUp value={entry.xp} suffix=" XP" /></strong>
            </Card>
          </motion.article>
        )) : (
          <Card style={styles.empty}>No customer activity yet. Save a daily log or check-in to start ranking.</Card>
        )}
      </section>
    </div>
  );
}

function medalColor(index: number) {
  if (index === 0) return theme.gold;
  if (index === 1) return theme.silver;
  if (index === 2) return theme.bronze;
  return "rgba(251,191,36,0.34)";
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: 32 },
  hero: { padding: 28, marginBottom: 18, background: "linear-gradient(135deg,#111118,#180f07)" },
  eyebrow: { color: theme.accent, fontSize: 10, letterSpacing: 4, fontWeight: 950 },
  title: { fontSize: "clamp(34px, 5vw, 62px)", margin: "8px 0" },
  copy: { color: theme.textSecondary, lineHeight: 1.7 },
  board: { display: "grid", gap: 12 },
  row: { display: "grid", gridTemplateColumns: "64px 62px minmax(0, 1fr) auto", alignItems: "center", gap: 14, padding: 16 },
  rank: { width: 46, height: 46, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 18, fontWeight: 950 },
  avatar: { width: 54, height: 54, borderRadius: "50%", display: "grid", placeItems: "center", objectFit: "cover", border: `2px solid ${theme.border}`, background: theme.gradient, color: "#fff", fontWeight: 950 },
  name: { margin: 0, fontSize: 20 },
  muted: { margin: "4px 0 0", color: theme.textSecondary },
  xp: { color: theme.accent, fontSize: 22 },
  empty: { padding: 22, color: theme.textSecondary },
};
