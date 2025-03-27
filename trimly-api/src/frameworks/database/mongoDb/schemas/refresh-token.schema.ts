import { Schema } from "mongoose";
import { IRefreshTokenModel } from "../models/refresh-token.model.js";

export const refreshTokenSchema = new Schema<IRefreshTokenModel>({
	user: {
		type: String,
		required: true,
	},
	userType: {
		type: String,
		enum: ["admin", "client", "barberShop"],
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
	expiresAt: {
		type: Date,
		required: true,
		expires: 604800, // 7 days in scnds
	},
});
