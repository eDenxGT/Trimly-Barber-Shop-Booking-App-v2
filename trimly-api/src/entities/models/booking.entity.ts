import { IBarberEntity } from "./barber.entity.js";
import { IClientEntity } from "./client.entity.js";
import { IServiceEntity } from "./service.enity.js";

export interface IBookingEntity {
	bookingId?: string;
	shopId: string;
	orderId: string;
	clientId: string;
	services: string[];
	date: Date;
	startTime: string;
	bookedTimeSlots: string[];
	duration: number;
	total: number;
	status?: "pending" | "completed" | "cancelled" | "confirmed";
	createdAt?: Date;
	updatedAt?: Date;
	servicesDetails?: IServiceEntity[];
	shopDetails?: IBarberEntity | null;
	clientDetails?: IClientEntity | null;
}
