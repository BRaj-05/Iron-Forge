"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { theme } from "@/lib/theme";

type Session = {
  _id?: string;
  title: string;
  trainerName?: string;
  scheduledAt?: string;
  durationMinutes?: number;
  status: string;
  focus: string;
};

const starterSessions: Session[] = [
  { title: "Strength Form Audit", trainerName: "Coach Arjun", scheduledAt: "Today, 6:30 PM", status: "BOOKED", focus: "FORM_CHECK" },
  { title: "Nutrition Review", trainerName: "Coach Mira", scheduledAt: "Tomorrow, 11:00 AM", status: "REQUESTED", focus: "DIET" },
  { title: "Mobility Reset", trainerName: "Coach Kavya", scheduledAt: "Friday, 7:00 PM", status: "REQUESTED", focus: "RECOVERY" },
];

export default function CustomerSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>(starterSessions);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function requestSession(focus: string, title: string) {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          focus,
          requestedDate: new Date().toISOString(),
          notes: "Requested from Phase 6 customer session UI.",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Could not request session.");
        return;
      }

      setSessions((prev) => [data, ...prev]);
      setMessage("Session request sent. Admin/trainer approval can be added next.");
    } catch {
      setMessage("Session request could not be sent right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>TRAINER SESSIONS</p>
        <h1 style={styles.title}>Book help before bad form becomes a habit.</h1>
        <p style={styles.copy}>
          Session booking is prepared here as a customer UI. Backend slot
          locking, trainer availability, and payments can plug into this flow.
        </p>
      </section>
      {message && <div style={styles.message}>{message}</div>}
      <section style={styles.grid}>
        {sessions.map((session) => (
          <article key={session._id || session.title} style={styles.card}>
            <span style={styles.status}>{session.status}</span>
            <h2>{session.title}</h2>
            <p>{session.trainerName || "Trainer assignment pending"}</p>
            <strong>{session.scheduledAt ? new Date(session.scheduledAt).toString() === "Invalid Date" ? session.scheduledAt : new Date(session.scheduledAt).toLocaleString() : "Timing requested"}</strong>
            <button
              disabled={loading}
              onClick={() => requestSession(session.focus, session.title)}
              style={styles.button}
            >
              {session.status === "BOOKED" ? "Request Follow-up" : "Request Slot"}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { padding: 32 },
  hero: { border: `1px solid ${theme.border}`, borderRadius: 28, padding: 34, marginBottom: 22, background: "linear-gradient(135deg,#111118,#160b05)" },
  eyebrow: { color: theme.accent, fontSize: 10, letterSpacing: 4, fontWeight: 950 },
  title: { fontSize: "clamp(42px, 6vw, 82px)", lineHeight: 0.95, maxWidth: 920, margin: "12px 0" },
  copy: { color: theme.textSecondary, lineHeight: 1.75, maxWidth: 760 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 },
  card: { border: `1px solid ${theme.border}`, borderRadius: 22, background: theme.surface, padding: 22, display: "grid", gap: 12 },
  status: { color: theme.green, fontWeight: 950, fontSize: 12 },
  button: { border: "none", borderRadius: 12, background: theme.gradient, color: "#fff", padding: "12px 14px", cursor: "pointer", fontWeight: 950 },
  message: { border: `1px solid ${theme.green}55`, background: `${theme.green}12`, color: theme.green, borderRadius: 14, padding: 14, marginBottom: 18 },
};
