export interface ICompleteBookingUseCase {
	execute(bookingId: string): Promise<void>;
}
