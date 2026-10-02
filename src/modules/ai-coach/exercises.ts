import {
  calculateAngle,
  horizontalBodyRatio,
  torsoLean,
  visible,
} from "./geometry";
import type { Analysis, ExerciseId, Point } from "./types";

type ExerciseConfig = {
  name: string;
  setup: string;
  low: number;
  high: number;
};

export const exerciseConfig: Record<ExerciseId, ExerciseConfig> = {
  SQUAT: {
    name: "Squats",
    setup:
      "Stand side-on. Keep shoulders, hips, knees and ankles visible. Beginner depth is accepted.",
    low: 118,
    high: 152,
  },
  PUSH_UP: {
    name: "Push-ups",
    setup:
      "Use a side view. Keep your shoulder, elbow, wrist and hips visible. Normal and beginner knee push-ups are supported.",
    low: 122,
    high: 150,
  },
  BICEPS_CURL: {
    name: "Biceps curls",
    setup:
      "Stand side-on. Keep one shoulder, elbow and wrist visible and curl under control.",
    low: 72,
    high: 145,
  },
  SHOULDER_PRESS: {
    name: "Shoulder press",
    setup:
      "Face slightly side-on and keep your shoulder, elbow and wrist visible through the full press.",
    low: 108,
    high: 148,
  },
  LUNGE: {
    name: "Lunges",
    setup:
      "Use a side view with hips, front knee and ankle visible. A comfortable beginner depth is accepted.",
    low: 125,
    high: 150,
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

type Side = typeof left;

function minConfidence(points: Point[], keys: number[]) {
  return Math.min(...keys.map((key) => points[key]?.visibility ?? 0));
}

function chooseLegReference(points: Point[], side: Side) {
  if (visible(points[side.ankle], 0.48)) return points[side.ankle];
  if (visible(points[side.knee], 0.48)) return points[side.knee];
  return null;
}

export function analyzePose(
  id: ExerciseId,
  points: Point[],
  aspect: number,
  lockedSide?: number,
): (Analysis & { side: number }) | null {
  if (!points.length) return null;

  const lowerBodyExercise = id === "SQUAT" || id === "LUNGE";

  const candidates = [left, right].map((side, index) => {
    let required: number[];

    if (lowerBodyExercise) {
      required = [side.shoulder, side.hip, side.knee, side.ankle];
    } else {
      required = [side.shoulder, side.elbow, side.wrist, side.hip];
    }

    if (!required.every((key) => visible(points[key], 0.52))) return null;

    const angle = lowerBodyExercise
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

    if (angle === null) return null;

    return {
      side,
      index,
      angle,
      confidence: minConfidence(points, required),
    };
  });

  // Keep the same side through a rep whenever possible.
  let selected =
    lockedSide !== undefined
      ? candidates[lockedSide]
      : candidates
          .filter((candidate) => candidate !== null)
          .sort((a, b) => b.confidence - a.confidence)[0];

  // If no side is locked yet, take any valid side.
  if (!selected && lockedSide === undefined) {
    selected = candidates.find(Boolean) ?? null;
  }

  if (!selected) return null;

  const { side, angle, index } = selected;
  const shoulder = points[side.shoulder];
  const hip = points[side.hip];
  const config = exerciseConfig[id];
  const issues: Analysis["issues"] = [];
  const issue = (type: string, message: string) =>
    issues.push({ type, message });

  let bodyAngle: number | null = null;
  let peakGate = true;

  if (id === "SQUAT") {
    const lean = torsoLean(shoulder, hip, aspect);
    if (lean > 58) issue("CHEST_LEAN", "Lift your chest slightly.");
    if (angle > config.low && angle < 140)
      issue("SQUAT_DEPTH", "Go a little deeper if comfortable.");
  }

  if (id === "LUNGE") {
    const lean = torsoLean(shoulder, hip, aspect);
    if (lean > 42) issue("TORSO_LEAN", "Keep your torso a little more upright.");
  }

  if (id === "BICEPS_CURL") {
    const drift = calculateAngle(points[side.elbow], shoulder, hip, aspect);
    if (drift !== null && drift > 38)
      issue("ELBOW_DRIFT", "Keep your elbow a little closer to your side.");

    const lean = torsoLean(shoulder, hip, aspect);
    if (lean > 30)
      issue("SWING", "Use less body swing and control the curl.");
  }

  if (id === "SHOULDER_PRESS") {
    const lean = torsoLean(shoulder, hip, aspect);
    if (lean > 34)
      issue("BACK_LEAN", "Reduce the backward lean and keep your core steady.");

    // Beginner presses do not need a perfect lockout. Wrist simply needs to
    // finish around or above shoulder height.
    peakGate = points[side.wrist].y <= shoulder.y + 0.03;
  }

  if (id === "PUSH_UP") {
    const legReference = chooseLegReference(points, side);
    if (!legReference) return null;

    bodyAngle = calculateAngle(shoulder, hip, legReference, aspect);
    if (bodyAngle === null) return null;

    // Reject upright curls/presses, but allow normal and knee push-ups,
    // including slightly diagonal camera angles.
    const horizontalRatio = horizontalBodyRatio(shoulder, legReference, aspect);
    if (horizontalRatio < 0.72) return null;

    if (bodyAngle < 140)
      issue("HIP_ALIGNMENT", "Keep your hips closer to your shoulder line.");

    if (angle > config.low && angle < 142)
      issue("RANGE", "Lower a little more if comfortable.");
  }

  const press = id === "SHOULDER_PRESS";

  return {
    side: index,
    angle,
    bodyAngle,
    peakGate,
    issues,
    start: press ? angle <= config.low : angle >= config.high,
    peak: press
      ? angle >= config.high && peakGate
      : angle <= config.low,
  };
}
