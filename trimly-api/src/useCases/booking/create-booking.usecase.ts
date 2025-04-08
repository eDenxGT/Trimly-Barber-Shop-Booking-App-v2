import { inject, injectable } from "tsyringe";
import { ICreateBookingUseCase } from "../../entities/useCaseInterfaces/booking/create-booking-usecase.interface.js";
import { IBookingRepository } from "./../../entities/repositoryInterfaces/booking/booking-repository.interface.js";
import { config } from "../../shared/config.js";
import Razorpay from "razorpay";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";

@injectable()
export class CreateBookingUseCase implements ICreateBookingUseCase {
	constructor(
		@inject("IBookingRepository")
		private _bookingRepository: IBookingRepository
	) {}
	async execute({
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
	}> {
		const bookingDateTime = new Date(date);

		if (bookingDateTime.getTime() < Date.now()) {
			throw new CustomError(
				ERROR_MESSAGES.YOU_CAN_ONLY_BOOK_FOR_FUTURE,
				HTTP_STATUS.BAD_REQUEST
			);
		}

		const existingBooking = await this._bookingRepository.findOne({
			shopId,
			date,
			bookedTimeSlots: { $in: bookedTimeSlots },
			status: "confirmed",
		});
		if (existingBooking) {
			throw new CustomError(
				ERROR_MESSAGES.BOOKING_EXISTS,
				HTTP_STATUS.CONFLICT
			);
		}
		const bookingId = generateUniqueId("booking");

		const razorpay = new Razorpay({
			key_id: config.payment.RAZORPAY_KEY_ID!,
			key_secret: config.payment.RAZORPAY_SECRET!,
		});

		const order = await razorpay.orders.create({
			amount: total * 100,
			currency: "INR",
			receipt: `receipt_${bookingId?.slice(0, 20)}`,
			notes: {
				bookingId: bookingId as string,
			},
		});

		await this._bookingRepository.save({
			bookedTimeSlots,
			bookingId,
			clientId,
			orderId: order.id,
			date: bookingDateTime,
			duration,
			services,
			shopId,
			startTime,
			total,
		});

		return {
			id: order.id,
			amount: order.amount as number,
			currency: order.currency,
			bookingId,
		};
	}
}
