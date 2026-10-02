"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CameraStage from "./CameraStage";
import { exerciseConfig } from "./exercises";
import {
  exerciseIds,
  type ExerciseId,
  type SessionInput,
  type Snapshot,
} from "./types";
import { apiRoutes } from "@/config/api-routes";
import styles from "./coach.module.css";

const initial: Snapshot = {
  reps: 0,
  goodReps: 0,
  formScore: 0,
  issues: [],
  stage: "READY",
  angle: null,
  status: "NO_POSE",
  message: "Position yourself in frame.",
};

export default function PostureCoach() {
  const [exercise, setExercise] = useState<ExerciseId>("SQUAT");
  const [targetReps, setTargetReps] = useState(10),
    [targetSets, setTargetSets] = useState(3);
  const [active, setActive] = useState(false),
    [ready, setReady] = useState(false),
    [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true),
    [seconds, setSeconds] = useState(0);
  const [snapshot, setSnapshot] = useState(initial);
  const [summary, setSummary] = useState<SessionInput | null>(null);
  const [saving, setSaving] = useState(false),
    [saved, setSaved] = useState(false),
    [error, setError] = useState("");
  const startedAt = useRef("");
  const speech = useRef({ text: "", time: 0 });

  useEffect(() => {
    if (!active || paused || !ready) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setSeconds((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [active, paused, ready]);
  useEffect(() => {
    if (muted || paused || !active || !("speechSynthesis" in window)) {
      window.speechSynthesis?.cancel();
      return;
    }
    const now = Date.now();
    if (
      snapshot.message !== speech.current.text &&
      now - speech.current.time > 2500
    ) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance(snapshot.message),
      );
      speech.current = { text: snapshot.message, time: now };
    }
  }, [snapshot.message, muted, paused, active]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function start() {
    setSummary(null);
    setSnapshot(initial);
    setSeconds(0);
    setSaved(false);
    setError("");
    setReady(false);
    setPaused(false);
    startedAt.current = new Date().toISOString();
    setActive(true);
  }
  function finish(result = snapshot) {
    setActive(false);
    setReady(false);
    window.speechSynthesis?.cancel();
    setSummary({
      clientSessionId: crypto.randomUUID(),
      exercise,
      targetSets,
      targetReps,
      completedReps: result.reps,
      goodReps: result.goodReps,
      issues: result.issues,
      durationSeconds: seconds,
      startedAt: startedAt.current,
      endedAt: new Date().toISOString(),
    });
  }
  function receive(result: Snapshot) {
    setSnapshot(result);
    if (result.reps >= targetReps * targetSets) finish(result);
  }
  async function save() {
    if (!summary || saving || saved) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(apiRoutes.customer.coachSessions, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(summary),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Could not save workout.");
      setSaved(true);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not save workout. Retry.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (summary)
    return (
      <section>
        <h2>Workout complete — {exerciseConfig[exercise].name}</h2>
        <div className={styles.metrics}>
          <div>
            <strong>
              {summary.completedReps} reps ·{" "}
              {Math.floor(summary.completedReps / targetReps)} completed sets
            </strong>
            <p>
              Form score: {snapshot.formScore}% · Active duration: {seconds}s
            </p>
            <p>{summary.goodReps} reps without a sustained form warning.</p>
          </div>
        </div>
        <h3>Form review</h3>
        <ul>
          {summary.issues.map((issue) => (
            <li key={issue.type}>
              {issue.message} — {issue.count} events
            </li>
          ))}
        </ul>
        {!summary.completedReps && (
          <p>
            No complete repetitions detected. Start another session and move
            through the full range.
          </p>
        )}
        <div className={styles.row}>
          <button
            onClick={() => void save()}
            disabled={saving || saved || !summary.completedReps}
          >
            {saved ? "Session saved" : saving ? "Saving…" : "Save session"}
          </button>
          <button onClick={() => setSummary(null)}>Train again</button>
          <Link href="/customer/progress">View progress</Link>
        </div>
        {error && <p role="alert">{error}</p>}
      </section>
    );

  return (
    <section>
      {!active ? (
        <>
          <h2>Choose your exercise</h2>
          <div className={styles.row}>
            {exerciseIds.map((id) => (
              <button
                key={id}
                aria-pressed={exercise === id}
                onClick={() => setExercise(id)}
              >
                {exerciseConfig[id].name}
              </button>
            ))}
          </div>
          <p>{exerciseConfig[exercise].setup}</p>
          <div className={styles.fields}>
            <label>
              Target reps
              <input
                type="number"
                min={1}
                max={100}
                value={targetReps}
                onChange={(e) =>
                  setTargetReps(
                    Math.max(
                      1,
                      Math.min(100, Math.floor(Number(e.target.value)) || 1),
                    ),
                  )
                }
              />
            </label>
            <label>
              Target sets
              <input
                type="number"
                min={1}
                max={20}
                value={targetSets}
                onChange={(e) =>
                  setTargetSets(
                    Math.max(
                      1,
                      Math.min(20, Math.floor(Number(e.target.value)) || 1),
                    ),
                  )
                }
              />
            </label>
          </div>
          <p>
            Camera analysis runs in your browser. Iron Forge saves workout
            metrics, not your workout video.
          </p>
          <button onClick={start}>Enable camera & start AI coach</button>
        </>
      ) : (
        <>
          <div className={styles.live}>
            <CameraStage
              exercise={exercise}
              paused={paused}
              onMetrics={receive}
              onReady={setReady}
            />
            <aside className={styles.metrics}>
              <h2>{exerciseConfig[exercise].name}</h2>
              <div>
                Set
                <strong>
                  {Math.min(
                    targetSets,
                    Math.floor(snapshot.reps / targetReps) + 1,
                  )}{" "}
                  / {targetSets}
                </strong>
              </div>
              <div>
                Reps this set
                <strong>
                  {snapshot.reps % targetReps} / {targetReps}
                </strong>
                <small>{snapshot.reps} total reps</small>
              </div>
              <div>
                Form score
                <strong>
                  {snapshot.reps
                    ? `${snapshot.formScore}%`
                    : "Awaiting first rep"}
                </strong>
              </div>
              <div>
                {seconds}s active · {snapshot.stage} · Joint angle{" "}
                {snapshot.angle ?? "—"}°
              </div>
              <div className={styles.feedback} role="status">
                <b>{snapshot.status.replaceAll("_", " ")}</b>
                <p>{snapshot.message}</p>
              </div>
            </aside>
          </div>
          <div className={styles.row}>
            <button onClick={() => setPaused(!paused)} disabled={!ready}>
              {paused ? "Resume" : "Pause"}
            </button>
            <button aria-pressed={!muted} onClick={() => setMuted(!muted)}>
              {muted ? "Unmute voice" : "Mute voice"}
            </button>
            <button onClick={() => finish()}>Finish workout</button>
          </div>
        </>
      )}
      <p>
        <small>
          Form score is the percentage of completed reps without a sustained
          warning. Camera coaching is approximate, not a medical assessment.
          Stop if movement causes pain.
        </small>
      </p>
    </section>
  );
}
