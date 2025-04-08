export interface IBooking {
	bookingId?: string;
	shopId: string;
	orderId?: string;
	services: string[];
	date: Date;
	startTime: string;
	bookedTimeSlots: string[];
	duration: number;
	total: number;
	clientId: string;
	status?: "pending" | "completed" | "cancelled" | "confirmed";
	createdAt?: Date;
	updatedAt?: Date;
}
