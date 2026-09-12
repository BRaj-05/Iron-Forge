import mongoose from "mongoose";

const YogaAsanaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sanskritName: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    categories: [{ type: String, trim: true, lowercase: true }],
    bodyParts: [{ type: String, trim: true }],
    goalTags: [{ type: String, trim: true }],
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    duration: String,
    benefits: [{ type: String }],
    steps: [{ type: String }],
    breathing: String,
    contraindications: [{ type: String }],
    modifications: [{ type: String }],
    commonMistakes: [{ type: String }],
    advancedVariation: String,
    youtubeId: String,
    imageSlot: String,
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

YogaAsanaSchema.index({ categories: 1, isActive: 1 });
YogaAsanaSchema.index({ goalTags: 1 });
YogaAsanaSchema.index({ name: "text", sanskritName: "text" });

export default mongoose.models.YogaAsana ||
  mongoose.model("YogaAsana", YogaAsanaSchema);
