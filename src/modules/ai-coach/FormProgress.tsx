"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { apiRoutes } from "@/config/api-routes";
import { exerciseConfig } from "./exercises";
import type { ExerciseId, SavedSession } from "./types";
import styles from "./coach.module.css";

type History = {
  sessions: SavedSession[];
  totalWorkouts: number;
  totalReps: number;
  averageScore: number;
  mostPracticed: ExerciseId | null;
};
export default function FormProgress() {
  const [history, setHistory] = useState<History | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setError("");
    try {
      const response = await fetch(apiRoutes.customer.coachSessions, {
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to load form progress.");
      setHistory(data);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to load form progress.",
      );
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  return (
    <section className={styles.progress}>
      <h2>AI Form Progress</h2>
      {error ? (
        <p role="alert">
          {error} <button onClick={() => void load()}>Retry</button>
        </p>
      ) : !history ? (
        <p>Loading your AI workouts…</p>
      ) : !history.totalWorkouts ? (
        <p>
          No AI Coach workouts yet.{" "}
          <Link href="/customer/ai-coach">Start your first AI workout</Link>
        </p>
      ) : (
        <>
          <div className={styles.row}>
            <span>{history.totalWorkouts} workouts</span>
            <span>{history.averageScore}% average form score</span>
            <span>{history.totalReps} tracked reps</span>
            <span>
              Most practiced:{" "}
              {history.mostPracticed
                ? exerciseConfig[history.mostPracticed]?.name
                : "—"}
            </span>
          </div>
          {history.sessions.length > 1 && (
            <div aria-label="Form score over recent sessions">
              <h3>Form score over time</h3>
              <ResponsiveContainer width="100%" height={230}>
                <LineChart
                  data={[...history.sessions]
                    .reverse()
                    .map((item) => ({
                      ...item,
                      date: new Date(item.endedAt).toLocaleDateString(),
                    }))}
                >
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line dataKey="formScore" stroke="#fb923c" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <p>Recent sessions (up to 30). Scores are coaching estimates.</p>
          <ul>
            {history.sessions.map((item) => (
              <li key={item.id}>
                {exerciseConfig[item.exercise]?.name} — {item.formScore}% ·{" "}
                {item.completedReps} reps · {item.completedSets} sets ·{" "}
                {item.durationSeconds}s ·{" "}
                {new Date(item.endedAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
