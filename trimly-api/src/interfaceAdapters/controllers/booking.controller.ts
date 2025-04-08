import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IBookingController } from "../../entities/controllerInterfaces/booking/booking-controller.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import { IGetAllBookingsUseCase } from "../../entities/useCaseInterfaces/booking/get-all-booking-usecase.interface.js";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants.js";
import { ICreateBookingUseCase } from "../../entities/useCaseInterfaces/booking/create-booking-usecase.interface.js";
import { IVerifyPaymentUseCase } from "../../entities/useCaseInterfaces/booking/verify-payment-usecase.interface.js";
import { IHandleFailurePaymentUseCase } from "../../entities/useCaseInterfaces/booking/handle-failure-payment-usecase.interface.js";

@injectable()
export class BookingController implements IBookingController {
	constructor(
		@inject("IGetAllBookingsUseCase")
		private _getAllBookingsUseCase: IGetAllBookingsUseCase,
		@inject("ICreateBookingUseCase")
		private _createBookingUseCase: ICreateBookingUseCase,
		@inject("IVerifyPaymentUseCase")
		private _verifyPaymentUseCase: IVerifyPaymentUseCase,
		@inject("IHandleFailurePaymentUseCase")
		private _handleFailurePaymentUseCase: IHandleFailurePaymentUseCase
	) {}

	//* ─────────────────────────────────────────────────────────────
	//*               🛠️ Get All Bookings By ShopId
	//* ─────────────────────────────────────────────────────────────
	async getAllBookings(req: Request, res: Response): Promise<void> {
		try {
			const { shopId } = req.query;
			const { role } = (req as CustomRequest).user;

			const bookings = await this._getAllBookingsUseCase.execute(
				String(shopId),
				role
			);
			res.status(HTTP_STATUS.OK).json({ success: true, bookings });
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*               🛠️ Get All Bookings By ShopId
	//* ─────────────────────────────────────────────────────────────
	async createBooking(req: Request, res: Response): Promise<void> {
		try {
			const {
				bookedTimeSlots,
				clientId,
				date,
				duration,
				services,
				shopId,
				startTime,
				total,
			} = req.body;

			const bookingData = await this._createBookingUseCase.execute({
				bookedTimeSlots,
				clientId,
				date,
				duration,
				services,
				shopId,
				startTime,
				total,
			});

			res.status(HTTP_STATUS.OK).json(bookingData);
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                    🛠️ Verify Payment
	//* ─────────────────────────────────────────────────────────────
	async verifyPayment(req: Request, res: Response): Promise<void> {
		try {
			const {
				razorpay_order_id,
				razorpay_payment_id,
				razorpay_signature,
				bookingId,
			} = req.body;

			await this._verifyPaymentUseCase.execute(
				razorpay_order_id,
				razorpay_payment_id,
				razorpay_signature,
				bookingId
			);

			res.status(HTTP_STATUS.ACCEPTED).json({
				success: true,
				message: SUCCESS_MESSAGES.PAYMENT_SUCCESS,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                 🛠️  Handle Payment Failure
	//* ─────────────────────────────────────────────────────────────
	async handlePaymentFailure(req: Request, res: Response): Promise<void> {
		try {
			const { orderId, status } = req.body;

			await this._handleFailurePaymentUseCase.execute(orderId, status);

			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.PAYMENT_FAILED,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}
}
