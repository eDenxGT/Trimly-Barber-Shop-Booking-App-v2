import { inject, injectable } from "tsyringe";
import { IHandleFailurePaymentUseCase } from "../../entities/useCaseInterfaces/booking/handle-failure-payment-usecase.interface.js";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface.js";
import { ITransactionRepository } from "../../entities/repositoryInterfaces/finance/transaction-repository.interface.js";

@injectable()
export class HandleFailurePaymentUseCase
  implements IHandleFailurePaymentUseCase
{
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("ITransactionRepository")
    private _transactionRepository: ITransactionRepository
  ) {}
  async execute(orderId: string, status: "cancelled"): Promise<void> {
    const booking = await this._bookingRepository.update(
      { orderId },
      { status }
    );
    await this._transactionRepository.update(
      {
        referenceId: booking?.bookingId,
        source: "booking",
      },
      {
        status: "failed",
      }
    );
  }
}
