import mongoose from "mongoose";

const CustomerTrainerSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    active: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
  },
  { timestamps: true },
);

CustomerTrainerSchema.index({ customerId: 1, trainerId: 1 }, { unique: true });

export default mongoose.models.CustomerTrainer ||
  mongoose.model("CustomerTrainer", CustomerTrainerSchema);
