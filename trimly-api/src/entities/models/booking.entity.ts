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
}
