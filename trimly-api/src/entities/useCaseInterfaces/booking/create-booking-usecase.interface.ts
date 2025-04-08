export interface ICreateBookingUseCase {
	execute({
		bookedTimeSlots,
		clientId,
		date,
		duration,
		services,
		shopId,
		startTime,
		total,
	}: {
		bookedTimeSlots: string[];
		clientId: string;
		date: string;
		duration: number;
		services: string[];
		shopId: string;
		startTime: string;
		total: number;
	}): Promise<{
		id: string;
		amount: number;
		currency: string;
		bookingId: string;
	}>;
}
