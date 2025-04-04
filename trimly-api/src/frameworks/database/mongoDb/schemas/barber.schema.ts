import { Schema } from "mongoose";
import { IBarberModel } from "../models/barber.model.js";

export const barberSchema = new Schema<IBarberModel>(
	{
		userId: { type: String, unique: true },
		shopName: { type: String },
		email: { type: String, required: true, unique: true },
		phoneNumber: { type: String, required: true },
		password: { type: String, required: true },
		role: { type: String, default: "barber" },
		avatar: { type: String },
		banner: { type: String },
		status: {
			type: String,
			enum: ["active", "blocked", "pending"],
			default: "pending",
		},
		rejectionReason: {
			type: String,
			default: "Complete your full profile by adding your shop details, at least one service, and setting your opening hours. For any queries, contact support at contact@trimly.in",
		},	
		description: { type: String },
		googleId: { type: String },
		openingHours: {
			monday: { type: Object, default: null },
			tuesday: { type: Object, default: null },
			wednesday: { type: Object, default: null },
			thursday: { type: Object, default: null },
			friday: { type: Object, default: null },
			saturday: { type: Object, default: null },
			sunday: { type: Object, default: null },
		},
		location: {
			name: { type: String },
			displayName: { type: String },
			zipCode: { type: String },
			latitude: { type: Number, default: null },
			longitude: { type: Number, default: null },
		},
	},
	{ timestamps: true }
);
