import mongoose from "mongoose";

const AIInsightSchema = new mongoose.Schema(
  {
    generatedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    type: {
      type: String,
      enum: [
        "CHURN_RISK",
        "WORKOUT",
        "DIET",
        "REVENUE",
        "ATTENDANCE",
        "ENGAGEMENT",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    score: Number,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

export default mongoose.models.AIInsight ||
  mongoose.model("AIInsight", AIInsightSchema);
