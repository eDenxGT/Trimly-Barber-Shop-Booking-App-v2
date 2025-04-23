export interface IBookWithWalletUseCase {
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
	}): Promise<void>;
}
