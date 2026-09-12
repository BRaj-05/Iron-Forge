import mongoose from "mongoose";

const DietPlanSchema = new mongoose.Schema(
  {
    scope: {
      type: String,
      enum: ["CUSTOMER", "EDUCATIONAL"],
      default: "CUSTOMER",
    },
    name: String,
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    goal: String,
    dietType: String,
    caloriesRange: String,
    proteinTargetText: String,
    meals: {
      breakfast: String,
      lunch: String,
      snack: String,
      dinner: String,
    },
    notes: [String],
    warnings: [String],
    trainerApproved: {
      type: Boolean,
      default: false,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
    },
    planName: { type: String, required: true },
    caloriesTarget: Number,
    proteinTarget: Number,
    carbsTarget: Number,
    active: {
      type: Boolean,
      default: true,
    },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true },
);

export default mongoose.models.DietPlan ||
  mongoose.model("DietPlan", DietPlanSchema);
