import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    membershipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GymBranch",
    },
    amount: Number,
    currency: {
      type: String,
      default: "INR",
    },
    paymentMethod: String,
    provider: {
      type: String,
      enum: ["MOCK", "STRIPE", "RAZORPAY", "CASH", "UPI", "CARD"],
      default: "MOCK",
    },
    transactionId: String,
    checkoutUrl: String,
    checkoutSessionId: String,
    providerOrderId: String,
    providerPaymentId: String,
    planName: String,
    paymentStatus: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING"],
      default: "PENDING",
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING", "REFUNDED"],
      default: "PENDING",
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
