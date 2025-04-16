import { inject, injectable } from "tsyringe";
import { parse, format } from "date-fns";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ICancelBookingUseCase } from "../../entities/useCaseInterfaces/booking/cancel-booking-usecase.interface.js";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { ITransactionRepository } from "../../entities/repositoryInterfaces/finance/transaction-repository.interface.js";
import { IWalletRepository } from "../../entities/repositoryInterfaces/finance/wallet-repository.interface.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";

@injectable()
export class CancelBookingUseCase implements ICancelBookingUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("IBarberRepository")
    private _barberRepository: IBarberRepository,
    @inject("IWalletRepository") private _walletRepository: IWalletRepository,
    @inject("ITransactionRepository")
    private _transactionRepository: ITransactionRepository
  ) {}

  async execute(bookingId: string): Promise<void> {
    const booking = await this._bookingRepository.findOne({ bookingId });
    if (!booking) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    if (booking.status === "cancelled") return;

    const bookingDate = new Date(booking.date);
    const startTimeStr = booking.startTime;

    const fullDateTimeStr = `${format(
      bookingDate,
      "yyyy-MM-dd"
    )} ${startTimeStr}`;
    const bookingStartTime = parse(
      fullDateTimeStr,
      "yyyy-MM-dd h:mm a",
      new Date()
    );

    const now = new Date();

    if (booking.status === "pending") {
      await this._bookingRepository.update(
        { bookingId },
        { status: "cancelled" }
      );
      await this._transactionRepository.update(
        {
          referenceId: bookingId,
          source: "booking",
        },
        {
          status: "failed",
        }
      );
      return;
    }

    const diffInMs = bookingStartTime.getTime() - now.getTime();
    const diffInMinutes = diffInMs / (1000 * 60);
    if (diffInMinutes < 60) {
      throw new CustomError(
        ERROR_MESSAGES.CANCEL_BOOKING_BEFORE_1_HOUR,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const transaction = await this._transactionRepository.findOne({
      referenceId: bookingId,
      source: "booking",
      status: "success",
    });

    if (!transaction) {
      throw new CustomError(
        ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    await Promise.all([
      this._bookingRepository.update({ bookingId }, { status: "cancelled" }),
      this._walletRepository.incrementBalance(booking.clientId, booking.total),
      this._transactionRepository.save({
        transactionId: generateUniqueId("transaction"),
        userId: booking.clientId,
        amount: booking.total,
        type: "credit",
        source: "refund",
        status: "success",
        referenceId: bookingId,
      }),
    ]);
  }
}
