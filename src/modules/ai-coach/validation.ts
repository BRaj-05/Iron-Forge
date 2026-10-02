import { z } from "zod";
import { exerciseIds } from "./types";

export const sessionSchema = z
  .object({
    clientSessionId: z.uuid(),
    exercise: z.enum(exerciseIds),
    targetSets: z.number().int().min(1).max(20),
    targetReps: z.number().int().min(1).max(100),
    completedReps: z.number().int().min(1).max(2000),
    goodReps: z.number().int().min(0).max(2000),
    durationSeconds: z.number().int().min(1).max(14400),
    startedAt: z.iso.datetime(),
    endedAt: z.iso.datetime(),
    issues: z
      .array(
        z
          .object({
            type: z.enum([
              "CHEST_LEAN",
              "TORSO_LEAN",
              "ELBOW_DRIFT",
              "SWING",
              "BACK_LEAN",
              "HIP_ALIGNMENT",
              "SHALLOW_RANGE",
            ]),
            message: z.string().min(1).max(160),
            count: z.number().int().min(1).max(2000),
          })
          .strict(),
      )
      .max(7),
  })
  .strict()
  .superRefine((value, context) => {
    const elapsed =
      (Date.parse(value.endedAt) - Date.parse(value.startedAt)) / 1000;
    if (
      value.goodReps > value.completedReps ||
      value.completedReps > value.targetSets * value.targetReps ||
      elapsed < value.durationSeconds - 2 ||
      elapsed > 86400 ||
      value.durationSeconds < value.completedReps * 0.5 ||
      Date.parse(value.endedAt) > Date.now() + 60000
    ) {
      context.addIssue({
        code: "custom",
        message: "Inconsistent workout totals or timestamps.",
      });
    }
    if (
      new Set(value.issues.map((item) => item.type)).size !==
      value.issues.length
    )
      context.addIssue({
        code: "custom",
        message: "Issues must be aggregated by type.",
      });
  });
