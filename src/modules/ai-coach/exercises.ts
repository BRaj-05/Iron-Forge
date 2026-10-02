import { calculateAngle, torsoLean, visible } from "./geometry";
import type { Analysis, ExerciseId, Point } from "./types";

export const exerciseConfig: Record<
  ExerciseId,
  { name: string; setup: string; low: number; high: number }
> = {
  SQUAT: {
    name: "Squats",
    setup: "Stand side-on. Keep shoulders, hips, knees and ankles in frame.",
    low: 100,
    high: 160,
  },
  PUSH_UP: {
    name: "Push-ups",
    setup: "Place the camera side-on at floor height. Show your whole body.",
    low: 105,
    high: 152,
  },
  BICEPS_CURL: {
    name: "Biceps curls",
    setup:
      "Stand side-on. Show shoulders, elbows, wrists and hips. Train one arm at a time.",
    low: 50,
    high: 160,
  },
  SHOULDER_PRESS: {
    name: "Shoulder press",
    setup: "Show shoulders, hips and hands, including full overhead reach.",
    low: 90,
    high: 160,
  },
  LUNGE: {
    name: "Lunges",
    setup:
      "Use a side view with both legs visible. Each return to standing counts once.",
    low: 100,
    high: 160,
  },
};

const left = {
  shoulder: 11,
  elbow: 13,
  wrist: 15,
  hip: 23,
  knee: 25,
  ankle: 27,
};
const right = {
  shoulder: 12,
  elbow: 14,
  wrist: 16,
  hip: 24,
  knee: 26,
  ankle: 28,
};

export function analyzePose(
  id: ExerciseId,
  points: Point[],
  aspect: number,
  lockedSide?: number,
): (Analysis & { side: number }) | null {
  const lower = id === "SQUAT" || id === "LUNGE";
  const minimumVisibility = lockedSide === undefined ? 0.65 : 0.52;
  const candidates = [left, right].map((side, index) => {
    const required = lower
      ? [side.shoulder, side.hip, side.knee, side.ankle]
      : [
          side.shoulder,
          side.elbow,
          side.wrist,
          side.hip,
        ];
    if (!required.every((key) => visible(points[key], minimumVisibility))) return null;
    const angle = lower
      ? calculateAngle(
          points[side.hip],
          points[side.knee],
          points[side.ankle],
          aspect,
        )
      : calculateAngle(
          points[side.shoulder],
          points[side.elbow],
          points[side.wrist],
          aspect,
        );
    return angle === null
      ? null
      : {
          side,
          index,
          angle,
          confidence: Math.min(
            ...required.map((key) => points[key].visibility ?? 0),
          ),
        };
  });
  // Lock the observed side for a full rep; switching arms must not manufacture a transition.
  const selected =
    lockedSide !== undefined && id !== "LUNGE"
      ? candidates[lockedSide]
      : candidates
          .filter((item) => item !== null)
          .sort((a, b) =>
            id === "LUNGE" ? a.angle - b.angle : b.confidence - a.confidence,
          )[0];
  if (!selected) return null;
  if (id === "LUNGE" && !candidates.every(Boolean)) return null;
  const { side, angle, index } = selected;
  const shoulder = points[side.shoulder],
    hip = points[side.hip];
  const lean = torsoLean(shoulder, hip, aspect);
  let bodyAngle: number | null = null;
  const issues: Analysis["issues"] = [];
  const issue = (type: string, message: string) =>
    issues.push({ type, message });
  if (id === "SQUAT" && lean > 50) issue("CHEST_LEAN", "Keep your chest up.");
  if (id === "LUNGE" && lean > 30)
    issue("TORSO_LEAN", "Keep your torso upright and lower under control.");
  if (id === "BICEPS_CURL") {
    const drift = calculateAngle(points[side.elbow], shoulder, hip, aspect);
    if (drift !== null && drift > 25)
      issue("ELBOW_DRIFT", "Keep your elbow close to your body.");
    if (lean > 20)
      issue("SWING", "Avoid swinging; control the lowering phase.");
  }
  if (id === "SHOULDER_PRESS" && lean > 25)
    issue("BACK_LEAN", "Avoid leaning backward; keep your core tight.");
  if (id === "PUSH_UP") {
    const support = visible(points[side.ankle], 0.5)
      ? points[side.ankle]
      : visible(points[side.knee], 0.5)
        ? points[side.knee]
        : null;
    if (support) bodyAngle = calculateAngle(shoulder, hip, support, aspect);
    if (bodyAngle !== null && bodyAngle < 150)
      issue(
        "HIP_ALIGNMENT",
        "Keep your hips aligned with your shoulders and ankles.",
      );
    // Upright elbow curls must not be mistaken for push-ups.
    const horizontal = Math.abs(shoulder.x - hip.x) * aspect;
    const vertical = Math.abs(shoulder.y - hip.y);
    if (horizontal < Math.max(0.08, vertical * 0.85))
      return null;
  }
  const config = exerciseConfig[id];
  const press = id === "SHOULDER_PRESS";
  const overhead = !press || points[side.wrist].y < shoulder.y - 0.08;
  return {
    side: index,
    angle,
    bodyAngle,
    peakGate: overhead,
    issues,
    start: press ? angle < config.low : angle > config.high,
    peak: press ? angle > config.high && overhead : angle < config.low,
  };
}
