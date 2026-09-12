import mongoose from "mongoose";

const TrainerSessionSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    focus: {
      type: String,
      enum: ["STRENGTH", "YOGA", "DIET", "CARDIO", "FORM_CHECK", "RECOVERY"],
      default: "FORM_CHECK",
    },
    requestedDate: Date,
    scheduledAt: Date,
    durationMinutes: {
      type: Number,
      default: 45,
    },
    status: {
      type: String,
      enum: ["REQUESTED", "BOOKED", "COMPLETED", "CANCELLED"],
      default: "REQUESTED",
    },
    notes: String,
    meetingUrl: String,
  },
  { timestamps: true },
);

export default mongoose.models.TrainerSession ||
  mongoose.model("TrainerSession", TrainerSessionSchema);
