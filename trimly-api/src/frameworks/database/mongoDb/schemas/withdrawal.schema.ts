import { Schema } from "mongoose";
import { IWithdrawalModel } from "../models/withdrawal.model.js";

export const withdrawalSchema = new Schema<IWithdrawalModel>(
  {
    walletId: { type: String, required: true },
    userId: { type: String, required: true },
    userType: {
      type: String,
      enum: ["client", "barber"],
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    method: {
      type: String,
      enum: ["upi", "bank_transfer"],
      required: true,
    },
    // UPI
    upiId: { type: String },
    // Bank Transfer
    accountHolderName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    bankName: { type: String },

    remarks: { type: String },
    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
  },
  { timestamps: true }
);
