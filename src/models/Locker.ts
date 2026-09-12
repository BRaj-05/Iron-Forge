import mongoose from "mongoose";

const LockerSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true,
    },
    lockerNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    combinationCode: {
      type: String,
      select: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Locker ||
  mongoose.model("Locker", LockerSchema);
