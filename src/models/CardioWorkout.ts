import mongoose from "mongoose";

const CardioWorkoutSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: { type: String, required: true, trim: true },
    intensity: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      default: "Moderate",
    },
    duration: String,
    goalTags: [{ type: String, trim: true }],
    beginnerPlan: [{ type: String }],
    intermediatePlan: [{ type: String }],
    advancedPlan: [{ type: String }],
    safetyNotes: [{ type: String }],
    equipment: String,
    youtubeId: String,
    imageSlot: String,
    calorieNote: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

CardioWorkoutSchema.index({ type: 1, isActive: 1 });
CardioWorkoutSchema.index({ goalTags: 1 });
CardioWorkoutSchema.index({ name: "text", type: "text" });

export default mongoose.models.CardioWorkout ||
  mongoose.model("CardioWorkout", CardioWorkoutSchema);
