import { inject, injectable } from "tsyringe";
import { IVerifyPaymentUseCase } from "../../entities/useCaseInterfaces/booking/verify-payment-usecase.interface.js";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface.js";
import crypto from "crypto";
import { config } from "../../shared/config.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { ITransactionRepository } from "../../entities/repositoryInterfaces/finance/transaction-repository.interface.js";
import { ISendNotificationByUserUseCase } from "../../entities/useCaseInterfaces/notifications/send-notification-by-user-usecase.interface.js";
import { formatDate } from "../../shared/utils/date-formatter.js";

@injectable()
export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("ITransactionRepository")
    private _transactionRepository: ITransactionRepository,
    @inject("ISendNotificationByUserUseCase")
    private _sendNotificationByUserUseCase: ISendNotificationByUserUseCase
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

    await this._transactionRepository.update(
      { referenceId: bookingId, source: "booking" },
      { status: "success" }
    );

    const booking = await this._bookingRepository.findOne({ bookingId });
    if (!booking) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    await this._sendNotificationByUserUseCase.execute({
      receiverId: booking.shopId,
      message: `📅 New booking scheduled for ${formatDate(
        booking.date.toString()
      )} at ${booking.startTime}.`,
    });

    await this._sendNotificationByUserUseCase.execute({
      receiverId: booking.clientId,
      message: `Your booking is confirmed for ${formatDate(
        booking.date.toString()
      )} at ${booking.startTime} ✅`,
    });
  }
}
