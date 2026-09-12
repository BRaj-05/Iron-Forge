import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GymBranch",
    },
    checkInTime: {
      type: Date,
      default: Date.now,
    },
    checkIn: {
      type: Date,
      default: Date.now,
    },
    checkOut: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema);
