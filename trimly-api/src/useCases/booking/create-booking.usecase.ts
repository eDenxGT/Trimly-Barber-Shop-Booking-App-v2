import { setHours, setMinutes, parseISO } from "date-fns";
import { inject, injectable } from "tsyringe";
import { ICreateBookingUseCase } from "../../entities/useCaseInterfaces/booking/create-booking-usecase.interface.js";
import { IBookingRepository } from "./../../entities/repositoryInterfaces/booking/booking-repository.interface.js";
import { config } from "../../shared/config.js";
import Razorpay from "razorpay";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { ITransactionRepository } from "../../entities/repositoryInterfaces/finance/transaction-repository.interface.js";
import { getBookingDateTimeUTC } from "../../shared/utils/get-booking-date-time-utc.helper.js";

@injectable()
export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("ITransactionRepository")
    private _transactionRepository: ITransactionRepository
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
    const bookingDateTime = getBookingDateTimeUTC(date, startTime);

    if (bookingDateTime.getTime() <= Date.now()) {
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

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const cancelledBookings = await this._bookingRepository.find({
      clientId,
      status: "cancelled",
      createdAt: { $gte: twoDaysAgo },
    });

    if (cancelledBookings.length > 5) {
      // throw new CustomError(
      //   ERROR_MESSAGES.MORE_THAN_5_CANCELLED_BOOKING,
      //   HTTP_STATUS.BAD_REQUEST
      // );
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await this._bookingRepository.find({
      clientId,
      shopId,
      status: "confirmed",
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (bookings.length >= 3) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_LIMIT_EXCEEDED_FOR_TODAY,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const bookingId = generateUniqueId("booking");
    const transactionId = generateUniqueId("transaction");

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

    await this._transactionRepository.save({
      transactionId,
      userId: clientId,
      amount: total,
      type: "debit",
      source: "booking",
      status: "pending",
      referenceId: bookingId,
    });

    return {
      id: order.id,
      amount: order.amount as number,
      currency: order.currency,
      bookingId,
    };
  }
}
