import { IReviewEntity } from "./review.entity.js";
import { IServiceEntity } from "./service.enity.js";
import { IUserEntity } from "./user.entity.js";

export interface IBarberEntity extends Omit<IUserEntity, "fullName"> {
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
	amenities: {
		wifi: boolean;
		parking: boolean;
	};
	rejectionReason?: string;
	location?: {
		type?: "Point";
		name?: string;
		displayName?: string;
		zipCode?: string;
		coordinates?: number[]
	};
}
