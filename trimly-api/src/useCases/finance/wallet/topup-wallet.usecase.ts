import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/finance/wallet-repository.interface.js";
import { ITopUpWalletUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/topup-wallet-usecase.interface.js";
import { ITransactionRepository } from "../../../entities/repositoryInterfaces/finance/transaction-repository.interface.js";
import { IRazorpayService } from "../../../entities/useCaseInterfaces/services/razorpay-service.interface.js";
import { generateUniqueId } from "../../../shared/utils/unique-uuid.helper.js";

@injectable()
export class TopUpWalletUseCase implements ITopUpWalletUseCase {
  constructor(
    @inject("ITransactionRepository")
    private _transactionRepository: ITransactionRepository,
    @inject("IRazorpayService")
    private _razorpayService: IRazorpayService,
    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository
  ) {}

  async execute(
    userId: string,
    role: "client" | "barber",
    transactionId: string,
    amount: number
  ): Promise<{
    orderId: string;
    amount: number;
    currency: string;
  }> {
    const razorpayOrder = await this._razorpayService.createOrder(
      amount,
      transactionId
    );

    const existingWallet = await this._walletRepository.findOne({
      ownerId: userId,
    });

    if (!existingWallet) {
      await this._walletRepository.save({
        walletId: generateUniqueId("wallet"),
        ownerId: userId,
        ownerType: role,
        balance: 0,
        currency: "INR",
      });
    }

    await this._transactionRepository.save({
      transactionId,
      userId,
      amount,
      orderId: razorpayOrder.id,
      type: "credit",
      source: "topup",
      status: "pending",
      referenceId: razorpayOrder.id,
    });

    return {
      orderId: razorpayOrder.id,
      amount,
      currency: razorpayOrder.currency,
    };
  }
}
