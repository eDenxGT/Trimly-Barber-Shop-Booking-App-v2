export interface ICancelBookingUseCase {
	execute(bookingId: string): Promise<void>;
}
