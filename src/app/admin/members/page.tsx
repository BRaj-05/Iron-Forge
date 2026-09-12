"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Member {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
  status: string;
  joined: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortByXP, setSortByXP] = useState(false);

  async function fetchMembers() {
    const res = await fetch("/api/admin/members");
    if (!res.ok) return;

    const data = await res.json();
    setMembers(data.members);
    setTotalMembers(data.totalMembers);
    setLoading(false);
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  if (loading)
    return <div style={{ padding: 32 }}>Loading Members...</div>;

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const displayed = sortByXP
    ? [...filtered].sort((a, b) => b.xp - a.xp)
    : filtered;

  return (
    <div style={{ padding: 32 }}>

      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontSize: 44,
          fontFamily: "'Bebas Neue', cursive",
          marginBottom: 30,
        }}
      >
        MEMBERS MANAGEMENT 👥
      </motion.h1>

      {/* SEARCH + SORT */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #1f2937",
            background: "#0f172a",
            color: "white",
            flex: 1,
          }}
        />

        <button
          onClick={() => setSortByXP(!sortByXP)}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #1f2937",
            background: "#1e293b",
            color: "white",
            cursor: "pointer",
          }}
        >
          {sortByXP ? "Clear Sort" : "Sort by XP"}
        </button>
      </div>

      {/* TOTAL CARD */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        style={{
          background: "linear-gradient(145deg,#0f172a,#1e293b)",
          padding: 24,
          borderRadius: 20,
          border: "1px solid #1f2937",
          marginBottom: 30,
        }}
      >
        <p style={{ color: "#94a3b8" }}>Total Members</p>
        <h2 style={{ fontSize: 36 }}>{totalMembers}</h2>
      </motion.div>

      {/* TABLE */}
      <div
        style={{
          background: "#0f172a",
          borderRadius: 20,
          border: "1px solid #1f2937",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead
            style={{
              background: "#1e293b",
              textAlign: "left",
              color: "#94a3b8",
            }}
          >
            <tr>
              <th style={{ padding: 16 }}>Name</th>
              <th>Email</th>
              <th>Level</th>
              <th>XP</th>
              <th>Streak</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>

          <tbody>
            {displayed.map((m) => (
              <motion.tr
                key={m.id}
                whileHover={{ backgroundColor: "#1e293b" }}
                style={{
                  borderTop: "1px solid #1f2937",
                }}
              >
                <td style={{ padding: 16 }}>{m.name}</td>
                <td>{m.email}</td>
                <td>LVL {m.level}</td>
                <td>{m.xp}</td>
                <td>🔥 {m.streak}</td>

                <td
                  style={{
                    color:
                      m.status === "ACTIVE"
                        ? "#22c55e"
                        : m.status === "FROZEN"
                        ? "#eab308"
                        : "#ef4444",
                    fontWeight: 600,
                  }}
                >
                  {m.status}
                </td>

                <td>
                  {new Date(m.joined).toLocaleDateString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
