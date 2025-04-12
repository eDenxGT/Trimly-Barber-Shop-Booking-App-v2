import { Schema } from "mongoose";
import { ITransactionModel } from "../models/transaction.model.js";

export const transactionSchema = new Schema<ITransactionModel>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    walletId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    source: {
      type: String,
      enum: ["booking", "topup", "withdrawal", "refund"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    referenceId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
