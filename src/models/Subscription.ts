import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    membershipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "CANCELLED", "FROZEN"],
      default: "ACTIVE",
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    provider: {
      type: String,
      enum: ["MOCK", "STRIPE", "RAZORPAY", "CASH", "UPI", "CARD"],
      default: "MOCK",
    },
    externalSubscriptionId: String,
    autoRenew: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);
