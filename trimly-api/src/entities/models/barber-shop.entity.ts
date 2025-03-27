import { IReviewEntity } from "./review.entity.js";
import { IUserEntity } from "./user.entity.js";

export interface IBarberShopEntity extends Omit<IUserEntity, "fullName"> {
	shopName?: string;
	banner?: string;
	description?: string;
	googleId?: string;
	openingHours: {
		[day: string]: {
			open?: string;
			close?: string;
		} | null;
	};
	location?: {
		name?: string;
		zipCode?: string;
		latitude?: number | null;
		longitude?: number | null;
	};
	services?: {
		serviceId: string;
		name: string;
		price: number;
		duration: string;
		genderType: "male" | "female" | "unisex";
		description?: string;
	}[];
}
