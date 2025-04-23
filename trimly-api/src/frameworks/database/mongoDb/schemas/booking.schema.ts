import { Schema } from "mongoose";
import { IBookingModel } from "../models/booking.model.js";

export const bookingSchema = new Schema<IBookingModel>(
	{
		bookingId: {
			type: String,
			required: true,
		},
		shopId: {
			type: String,
			required: true,
		},
		orderId: {
			type: String,
		},
		clientId: {
			type: String,
			required: true,
		},
		services: {
			type: [String],
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		startTime: {
			type: String,
			required: true,
		},
		bookedTimeSlots: {
			type: [String],
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
		total: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "confirmed", "completed", "cancelled"],
			default: "pending",
		},
	},
	{
		timestamps: true,
	}
);
