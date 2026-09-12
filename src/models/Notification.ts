import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "PAYMENT_DUE",
        "MEMBERSHIP_EXPIRY",
        "WORKOUT",
        "ATTENDANCE",
        "SYSTEM",
      ],
      default: "SYSTEM",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
