import mongoose from "mongoose";

const BodyMeasurementSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    weight: Number,
    bodyFat: Number,
    chest: Number,
    waist: Number,
    arms: Number,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.models.BodyMeasurement ||
  mongoose.model("BodyMeasurement", BodyMeasurementSchema);
