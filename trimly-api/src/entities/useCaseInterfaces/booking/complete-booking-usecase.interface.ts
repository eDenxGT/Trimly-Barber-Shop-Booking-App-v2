export interface ICompleteBookingUseCase {
	execute(bookingId: string, role: string): Promise<void>;
}
