import { inject, injectable } from "tsyringe";
import { IHandleTopUpPaymentFailureUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/handle-topup-failure-payment-usecase.interface.js";
import { ITransactionRepository } from "../../../entities/repositoryInterfaces/finance/transaction-repository.interface.js";

@injectable()
export class HandleTopUpPaymentFailureUseCase
  implements IHandleTopUpPaymentFailureUseCase
{
  constructor(
    @inject("ITransactionRepository")
    private _transactionRepository: ITransactionRepository
  ) {}
  async execute(orderId: string, status: "failed"): Promise<void> {
    await this._transactionRepository.update({ orderId }, { status });
  }
}
