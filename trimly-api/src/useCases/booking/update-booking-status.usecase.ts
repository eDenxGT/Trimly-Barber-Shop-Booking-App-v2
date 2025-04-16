import { inject, injectable } from "tsyringe";
import { parse, format, addMinutes } from "date-fns";
import { CustomError } from "../../entities/utils/custom.error.js";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { ICompleteBookingUseCase } from "../../entities/useCaseInterfaces/booking/update-booking-status-usecase.interface.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IWalletRepository } from "../../entities/repositoryInterfaces/finance/wallet-repository.interface.js";
import { ITransactionRepository } from "../../entities/repositoryInterfaces/finance/transaction-repository.interface.js";

@injectable()
export class CompleteBookingUseCase implements ICompleteBookingUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository,
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

    const bookingEndTime = addMinutes(bookingStartTime, booking.duration);

    const now = new Date();
    if (now < bookingEndTime) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_CANNOT_COMPLETE_BEFORE_TIME_ENDS,
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

    await this._bookingRepository.update(
      { bookingId },
      { status: "completed" }
    );

    await this._walletRepository.incrementBalance(
      booking.shopId,
      booking.total
    );
  }
}
