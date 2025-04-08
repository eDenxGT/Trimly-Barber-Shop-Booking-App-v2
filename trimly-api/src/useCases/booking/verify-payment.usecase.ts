import { inject, injectable } from "tsyringe";
import { IVerifyPaymentUseCase } from "../../entities/useCaseInterfaces/booking/verify-payment-usecase.interface.js";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface.js";
import crypto from "crypto";
import { config } from "../../shared/config.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { HTTP_STATUS } from "../../shared/constants.js";

@injectable()
export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
	constructor(
		@inject("IBookingRepository")
		private _bookingRepository: IBookingRepository
	) {}
	async execute(
		razorpay_order_id: string,
		razorpay_payment_id: string,
		razorpay_signature: string,
		bookingId: string
	): Promise<void> {
		const secret = config.payment.RAZORPAY_SECRET!;
		const body = `${razorpay_order_id}|${razorpay_payment_id}`;

		const expectedSignature = crypto
			.createHmac("sha256", secret)
			.update(body.toString())
			.digest("hex");

		if (expectedSignature !== razorpay_signature) {
			throw new CustomError(
				"Invalid signature. Payment verification failed.",
				HTTP_STATUS.BAD_REQUEST
			);
		}
		await this._bookingRepository.update(
			{ bookingId },
			{ status: "confirmed" }
		);
	}
}
