export const exerciseIds = [
  "SQUAT",
  "PUSH_UP",
  "BICEPS_CURL",
  "SHOULDER_PRESS",
  "LUNGE",
] as const;
export type ExerciseId = (typeof exerciseIds)[number];
export type Point = { x: number; y: number; visibility?: number };
export type Issue = { type: string; message: string; count: number };
export type Analysis = {
  angle: number;
  issues: Omit<Issue, "count">[];
  start: boolean;
  peak: boolean;
};
export type Snapshot = {
  reps: number;
  goodReps: number;
  stage: string;
  angle: number | null;
  status: "GOOD" | "WARNING" | "NO_POSE";
  message: string;
  issues: Issue[];
  formScore: number;
};
export type SessionInput = {
  clientSessionId: string;
  exercise: ExerciseId;
  targetSets: number;
  targetReps: number;
  completedReps: number;
  goodReps: number;
  issues: Issue[];
  durationSeconds: number;
  startedAt: string;
  endedAt: string;
};
export type SavedSession = SessionInput & {
  id: string;
  completedSets: number;
  formScore: number;
  formIssueCount: number;
};
