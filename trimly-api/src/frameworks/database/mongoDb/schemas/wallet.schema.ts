import { Schema } from "mongoose";
import { IWalletModel } from "../models/wallet.model.js";

export const walletSchema = new Schema<IWalletModel>(
  {
    walletId: { type: String, required: true },
    ownerId: { type: String, required: true },
    ownerType: { type: String, enum: ["barber", "client"], required: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
  },
  {
    timestamps: true,
  }
);
