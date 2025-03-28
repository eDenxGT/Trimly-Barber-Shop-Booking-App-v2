import { Schema } from "mongoose";
import { IClientModel } from "../models/client.model.js";

export const clientSchema = new Schema<IClientModel>(
	{
		userId: { type: String, unique: true },
		fullName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		role: { type: String, default: "client" },
		password: { type: String, required: true },
		avatar: { type: String },
		phoneNumber: { type: String },
		status: {
			type: String,
			enum: ["active", "blocked", "pending"],
			default: "active",
		},
		googleId: { type: String },
		location: {
			name: { type: String, default: null },
			displayName: { type: String, default: null },
			zipCode: { type: String, default: null },
			latitude: { type: Number, default: null },
			longitude: { type: Number, default: null },
		},
	},
	{ timestamps: true }
);
