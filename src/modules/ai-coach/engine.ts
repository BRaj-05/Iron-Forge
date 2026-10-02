import { analyzePose, exerciseConfig } from "./exercises";
import type { ExerciseId, Point, Snapshot } from "./types";

export function formScore(reps: number, goodReps: number) {
  return reps ? Math.round((100 * goodReps) / reps) : 0;
}

export class WorkoutEngine {
  private phase: "READY" | "START" | "PEAK" = "READY";
  private side: number | undefined;
  private candidate = "";
  private since = 0;
  private lastTime = 0;
  private lastRep = -Infinity;
  private missingSince: number | null = null;
  private smoothedAngle: number | null = null;
  private issueSince = new Map<string, number>();
  private emitted = new Set<string>();
  private dirtyRep = false;
  private moved = false;
  private reps = 0;
  private goodReps = 0;
  private issues = new Map<
    string,
    { type: string; message: string; count: number }
  >();
  constructor(readonly exercise: ExerciseId) {}

  resetTracking() {
    this.phase = "READY";
    this.side = undefined;
    this.candidate = "";
    this.issueSince.clear();
    this.emitted.clear();
    this.dirtyRep = false;
    this.moved = false;
    this.smoothedAngle = null;
  }

  update(points: Point[], time: number, aspect = 1): Snapshot {
    if (time - this.lastTime > 700) this.resetTracking();
    this.lastTime = time;
    const analysis = analyzePose(this.exercise, points, aspect, this.side);
    let message = "Get into your starting position.";
    let status: Snapshot["status"] = "POSE_FOUND";
    if (!analysis) {
      this.missingSince ??= time;
      const missingFor = time - this.missingSince;
      if (missingFor > 650) {
        this.resetTracking();
        this.missingSince = time - 651;
        status = "NO_POSE";
        message = "Step into frame and keep your working side visible.";
      } else {
        status = "PARTIAL_POSE";
        message = "Tracking… move back slightly so your arm and legs stay visible.";
      }
    } else {
      this.missingSince = null;
      this.smoothedAngle = this.smoothedAngle === null
        ? analysis.angle
        : this.smoothedAngle * 0.62 + analysis.angle * 0.38;
      const present = new Set(analysis.issues.map((item) => item.type));
      for (const key of this.issueSince.keys())
        if (!present.has(key)) this.issueSince.delete(key);
      for (const item of analysis.issues) {
        if (!this.issueSince.has(item.type))
          this.issueSince.set(item.type, time);
        if (time - this.issueSince.get(item.type)! >= 450) {
          status = "WARNING";
          message = item.message;
          if (this.phase !== "READY") {
            this.dirtyRep = true;
            if (!this.emitted.has(item.type)) {
              this.emitted.add(item.type);
              this.issues.set(item.type, {
                ...item,
                count: (this.issues.get(item.type)?.count ?? 0) + 1,
              });
            }
          }
        }
      }
      const config = exerciseConfig[this.exercise];
      const press = this.exercise === "SHOULDER_PRESS";
      const start = press ? this.smoothedAngle < config.low : this.smoothedAngle > config.high;
      const peak = press ? this.smoothedAngle > config.high && analysis.peakGate : this.smoothedAngle < config.low;
      const next = start ? "START" : peak ? "PEAK" : "MIDDLE";
      if (next !== this.candidate) {
        this.candidate = next;
        this.since = time;
      }
      if (this.phase === "START" && next === "MIDDLE") this.moved = true;
      if (time - this.since >= 160) {
        if (this.phase === "READY" && next === "START") {
          this.phase = "START";
          this.side = analysis.side;
        } else if (this.phase === "START" && next === "PEAK")
          this.phase = "PEAK";
        else if (
          this.phase === "PEAK" &&
          next === "START" &&
          time - this.lastRep >= 700
        ) {
          this.reps++;
          if (!this.dirtyRep) this.goodReps++;
          this.lastRep = time;
          this.resetTracking();
          message = "Rep complete. Reset with control.";
        } else if (this.phase === "START" && next === "START" && this.moved) {
          message = "Use your full comfortable range before returning.";
          status = "WARNING";
          this.moved = false;
        }
      }
      if (status === "POSE_FOUND" && this.phase !== "READY")
        message =
          this.phase === "PEAK"
            ? "Good range. Return under control."
            : "Ready. Move slowly through the full range.";
    }
    return {
      reps: this.reps,
      goodReps: this.goodReps,
      stage: this.phase,
      angle: this.smoothedAngle === null ? null : Math.round(this.smoothedAngle),
      status,
      message,
      issues: [...this.issues.values()],
      formScore: formScore(this.reps, this.goodReps),
      side: analysis ? (analysis.side === 0 ? "LEFT" : "RIGHT") : this.side === undefined ? null : this.side === 0 ? "LEFT" : "RIGHT",
      bodyAngle: analysis?.bodyAngle == null ? null : Math.round(analysis.bodyAngle),
    };
  }
}
