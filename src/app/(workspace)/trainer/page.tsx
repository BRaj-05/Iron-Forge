"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { DEFAULT_AVATAR_URL } from "@/lib/media";
import { theme } from "@/lib/theme";

type Customer = {
  id: string;
  name: string;
  photoUrl?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  heightCm?: number | null;
  weightKg?: number | null;
};
type Attendance = { id: string; customerId: string; checkIn: string; checkOut?: string | null };
type WorkoutLog = {
  id: string;
  customerId: string;
  logDate: string;
  workoutName: string;
  exercises: unknown;
  completed: boolean;
  notes?: string | null;
};
type DietLog = {
  id: string;
  customerId: string;
  logDate: string;
  meals: unknown;
  waterCups: number;
  completed: boolean;
};

function ageFromDate(date?: string | null) {
  if (!date) return "Age not set";
  const birthDate = new Date(date);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthOffset = today.getMonth() - birthDate.getMonth();
  if (monthOffset < 0 || (monthOffset === 0 && today.getDate() < birthDate.getDate())) age -= 1;
  return `${age} years`;
}

export default function TrainerDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [diets, setDiets] = useState<DietLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadData() {
    const response = await fetch("/api/trainer/dashboard", { cache: "no-store" });
    const payload = await response.json();
    if (response.ok) {
      setCustomers(payload.customers || []);
      setAttendance(payload.attendance || []);
      setWorkouts(payload.workouts || []);
      setDiets(payload.diets || []);
    } else {
      setMessage(payload.error || "Could not load trainer dashboard.");
    }
    setLoading(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function markAttendance(customerId: string) {
    setMessage("");
    const response = await fetch("/api/trainer/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error || "Could not mark attendance.");
      return;
    }
    setMessage("Attendance marked.");
    await loadData();
  }

  if (loading) return <main style={styles.page}>Loading trainer dashboard...</main>;

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <p style={styles.eyebrow}>TRAINER</p>
        <h1 style={styles.title}>Assigned Members</h1>
      </header>

      {message && <div style={styles.message}>{message}</div>}

      <section style={styles.grid}>
        {customers.length ? customers.map((customer) => {
          const customerWorkouts = workouts.filter((item) => item.customerId === customer.id);
          const customerDiets = diets.filter((item) => item.customerId === customer.id);

          return (
            <article key={customer.id} style={styles.card}>
              <Image src={customer.photoUrl || DEFAULT_AVATAR_URL} alt="" width={54} height={54} unoptimized style={styles.avatar} />
              <div>
                <h2 style={styles.name}>{customer.name}</h2>
                <p style={styles.muted}>{ageFromDate(customer.dateOfBirth)} - {customer.gender || "Sex not set"}</p>
                <p style={styles.muted}>
                  {customer.heightCm ? `${customer.heightCm} cm` : "Height not set"} / {customer.weightKg ? `${customer.weightKg} kg` : "Weight not set"}
                </p>
              </div>
              <Button onClick={() => markAttendance(customer.id)} variant="success" style={styles.button}>Mark check-in</Button>
              <div style={styles.logBox}>
                <strong>Workout log</strong>
                {customerWorkouts.length ? customerWorkouts.map((log) => (
                  <span key={log.id}>{log.logDate}: {log.workoutName} - {log.completed ? "done" : "pending"}</span>
                )) : <span style={styles.muted}>No workout log yet.</span>}
              </div>
              <div style={styles.logBox}>
                <strong>Diet log</strong>
                {customerDiets.length ? customerDiets.map((log) => (
                  <span key={log.id}>{log.logDate}: {log.completed ? "followed" : "not complete"} - {log.waterCups} cups water</span>
                )) : <span style={styles.muted}>No diet log yet.</span>}
              </div>
            </article>
          );
        }) : <p style={styles.muted}>No customers are assigned yet.</p>}
      </section>

      <section style={styles.panel}>
        <h2>Recent attendance</h2>
        <div style={styles.list}>
          {attendance.length ? attendance.map((item) => (
            <span key={item.id}>{new Date(item.checkIn).toLocaleString()} - customer {item.customerId.slice(-6)}</span>
          )) : <span style={styles.muted}>No attendance marked yet.</span>}
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", padding: 32, background: theme.bg, color: theme.textPrimary },
  header: { marginBottom: 24 },
  eyebrow: { color: theme.accent, fontSize: 12, letterSpacing: 2, fontWeight: 900 },
  title: { fontSize: 44, margin: "8px 0 0" },
  message: { padding: 12, marginBottom: 16, borderRadius: 8, border: `1px solid ${theme.accent}`, color: theme.accent, background: `${theme.accent}12` },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 14, marginBottom: 20 },
  card: { border: `1px solid ${theme.border}`, background: theme.surface, borderRadius: 10, padding: 18, display: "grid", gap: 14 },
  avatar: { width: 54, height: 54, borderRadius: "50%", objectFit: "cover", display: "grid", placeItems: "center", background: theme.gradient, color: "#fff", fontWeight: 900 },
  name: { margin: 0, fontSize: 22 },
  muted: { color: theme.textSecondary },
  button: { padding: "12px 14px" },
  logBox: { display: "grid", gap: 6, padding: 12, borderRadius: 8, background: theme.surfaceAlt, color: theme.textSecondary },
  panel: { border: `1px solid ${theme.border}`, background: theme.surface, borderRadius: 10, padding: 20 },
  list: { display: "grid", gap: 8, color: theme.textSecondary },
};
