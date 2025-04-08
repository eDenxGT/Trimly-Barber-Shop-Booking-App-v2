export interface IVerifyPaymentUseCase {
	execute(
		razorpay_order_id: string,
		razorpay_payment_id: string,
		razorpay_signature: string,
		bookingId: string
	): Promise<void>;
}
