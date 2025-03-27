import { Schema } from "mongoose";
import { IBarberShopModel } from "../models/barber-shop.model.js";

export const barberShopSchema = new Schema<IBarberShopModel>(
	{
		userId: { type: String, unique: true },
		email: { type: String, required: true, unique: true },
		phoneNumber: { type: String, required: true },
		password: { type: String, required: true },
		role: { type: String, default: "barberShop" },
		avatar: { type: String },
		banner: { type: String },
		status: {
			type: String,
			enum: ["active", "blocked", "pending"],
			default: "pending",
		},
		description: { type: String },
		shopName: { type: String },
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
			zipCode: { type: String },
			latitude: { type: Number, default: null },
			longitude: { type: Number, default: null },
		},
		services: [
			{
				serviceId: { type: String, required: true },
				name: { type: String, required: true },
				price: { type: Number, required: true },
				duration: { type: String, required: true },
				genderType: {
					type: String,
					enum: ["male", "female", "unisex"],
					required: true,
				},
				description: { type: String },
			},
		],
	},
	{ timestamps: true }
);
