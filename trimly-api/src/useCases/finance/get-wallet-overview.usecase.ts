import { inject, injectable } from "tsyringe";
import { IGetWalletOverviewUseCase } from "../../entities/useCaseInterfaces/finance/wallet/get-wallet-overview-usecase.interface.js";
import { TRole } from "../../shared/constants.js";
import { IWalletOverviewDTO } from "../../shared/dtos/user.dto.js";
import { IGetWalletByUserUseCase } from "../../entities/useCaseInterfaces/finance/wallet/get-wallet-by-user-usecase.interface.js";
import { IGetTransactionByUserUseCase } from "../../entities/useCaseInterfaces/finance/transaction/get-transaction-by-user-usecase.interface.js";
import { IGetWithdrawalByUserUseCase } from "../../entities/useCaseInterfaces/finance/withdrawal/get-withdrawal-by-user-usecase.interface.js";

@injectable()
export class GetWalletOverviewUseCase implements IGetWalletOverviewUseCase {
  constructor(
    @inject("IGetWalletByUserUseCase")
    private _getWalletByUserUseCase: IGetWalletByUserUseCase,
    @inject("IGetTransactionByUserUseCase")
    private _getTransactionByUserUseCase: IGetTransactionByUserUseCase,
    @inject("IGetWithdrawalByUserUseCase")
    private _getWithdrawalByUserUseCase: IGetWithdrawalByUserUseCase
  ) {}
  async execute(
    userId: string,
    role: TRole
  ): Promise<IWalletOverviewDTO | null> {
    const wallet = await this._getWalletByUserUseCase.execute(userId, role);
    if (!wallet) {
      return null;
    }

    const transactions = await this._getTransactionByUserUseCase.execute(
      userId
    );
    if (!transactions) {
      return null;
    }

    const withdrawals = await this._getWithdrawalByUserUseCase.execute(userId);
    if (!withdrawals) {
      return null;
    }

    return {
      balance: wallet.balance,
      transactions,
      withdrawals,
    };
  }
}
