import mongoose from "mongoose";

const WorkoutEquipmentSchema = new mongoose.Schema(
  {
    workoutScheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutSchedule",
      required: true,
    },
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    notes: String,
  },
  { timestamps: true },
);

export default mongoose.models.WorkoutEquipment ||
  mongoose.model("WorkoutEquipment", WorkoutEquipmentSchema);
