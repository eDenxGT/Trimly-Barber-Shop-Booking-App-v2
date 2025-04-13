import { inject, injectable } from "tsyringe";
import { IWithdrawFromWalletUseCase } from "../../../entities/controllerInterfaces/finance/withdraw-from-wallet-usecase.interface.js";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/finance/wallet-repository.interface.js";
import { CustomError } from "../../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";
import { IWithdrawalRepository } from "../../../entities/repositoryInterfaces/finance/withdrawal-repository.interface.js";
import { generateUniqueId } from "../../../shared/utils/unique-uuid.helper.js";
import { ITransactionRepository } from "../../../entities/repositoryInterfaces/finance/transaction-repository.interface.js";

@injectable()
export class WithdrawFromWalletUseCase implements IWithdrawFromWalletUseCase {
  constructor(
    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository,
    @inject("IWithdrawalRepository")
    private _withdrawalRepository: IWithdrawalRepository,
    @inject("ITransactionRepository")
    private _transactionRepository: ITransactionRepository
  ) {}
  async execute(
    userId: string,
    role: "client" | "barber",
    amount: number,
    method: "upi" | "bank",
    accountDetails: {
      upiId?: string;
      accountHolderName?: string;
      accountNumber?: string;
      ifscCode?: string;
      bankName?: string;
    }
  ): Promise<void> {
    const wallet = await this._walletRepository.findOne({
      ownerId: userId,
    });

    if (!wallet) {
      throw new CustomError(
        ERROR_MESSAGES.WALLET_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (amount > wallet.balance) {
      throw new CustomError(
        ERROR_MESSAGES.INSUFFICIENT_FUNDS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this._withdrawalRepository.save({
      withdrawalId: generateUniqueId("withdrawal"),
      walletId: wallet.walletId,
      userId,
      userType: role,
      amount,
      method,
      status: "pending",
      ...accountDetails,
      requestedAt: new Date(),
    });

    await this._walletRepository.update(
      {
        ownerId: userId,
      },
      {
        balance: wallet.balance - amount,
      }
    );

    await this._transactionRepository.save({
      transactionId: generateUniqueId("transaction"),
      userId,
      walletId: wallet.walletId,
      type: "debit",
      source: "withdrawal",
      amount,
      status: "pending",
    });
  }
}
