import mongoose from "mongoose";

const WorkoutScheduleSchema = new mongoose.Schema(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    exercise: { type: String, required: true },
    sets: Number,
    reps: Number,
    restTime: Number,
    workoutTime: Number,
    planName: String,
    date: Date,
  },
  { timestamps: true },
);

export default mongoose.models.WorkoutSchedule ||
  mongoose.model("WorkoutSchedule", WorkoutScheduleSchema);
