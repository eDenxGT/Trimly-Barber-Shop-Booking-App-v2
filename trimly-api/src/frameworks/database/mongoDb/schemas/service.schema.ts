import { Schema } from "mongoose";
import { IServiceModel } from "../models/service.model.js";

export const serviceSchema = new Schema<IServiceModel>(
	{
		serviceId: { type: String, required: true },
		barberId: { type: String, required: true },
		name: { type: String, required: true },
		price: { type: Number, required: true },
		status: {
			type: String,
			enum: ["active", "blocked"],
			default: "active",
		},
		genderType: {
			type: String,
			enum: ["male", "female", "unisex"],
			required: true,
		},
		description: { type: String },
	},
	{ timestamps: true }
);
