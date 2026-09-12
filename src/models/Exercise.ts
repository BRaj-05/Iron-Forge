import mongoose from "mongoose";

const SetsRepsSchema = new mongoose.Schema(
  {
    beginner: String,
    intermediate: String,
    advanced: String,
  },
  { _id: false },
);

const ExerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    muscleGroup: { type: String, required: true, trim: true },
    muscleSlug: { type: String, required: true, lowercase: true, trim: true },
    targetMuscles: [{ type: String, trim: true }],
    secondaryMuscles: [{ type: String, trim: true }],
    equipment: [{ type: String, trim: true }],
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    goalTags: [{ type: String, trim: true }],
    description: { type: String, required: true },
    steps: [{ type: String }],
    postureChecklist: [{ type: String }],
    breathing: String,
    commonMistakes: [{ type: String }],
    safetyNotes: [{ type: String }],
    setsReps: SetsRepsSchema,
    alternatives: [{ type: String }],
    youtubeId: String,
    imageSlot: String,
    mainBenefit: String,
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

ExerciseSchema.index({ muscleSlug: 1, isActive: 1 });
ExerciseSchema.index({ goalTags: 1 });
ExerciseSchema.index({ name: "text", description: "text", muscleGroup: "text" });

export default mongoose.models.Exercise ||
  mongoose.model("Exercise", ExerciseSchema);
