import { inject, injectable } from "tsyringe";
import { IUpdateWalletBalanceUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/update-wallet-balance-usecase.interface.js";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/finance/wallet-repository.interface.js";
import { ITransactionRepository } from "../../../entities/repositoryInterfaces/finance/transaction-repository.interface.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";
import { CustomError } from "../../../entities/utils/custom.error.js";
import { generateUniqueId } from "../../../shared/utils/unique-uuid.helper.js";
import { ICreateWalletUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/create-wallet-usecase.interface.js";
import { IGetWalletByUserUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/get-wallet-by-user-usecase.interface.js";

@injectable()
export class UpdateWalletBalanceUseCase implements IUpdateWalletBalanceUseCase {
	constructor(
		@inject("IWalletRepository")
		private _walletRepository: IWalletRepository,
		@inject("ITransactionRepository")
		private _transactionRepository: ITransactionRepository,
		@inject("ICreateWalletUseCase")
		private _createWalletUseCase: ICreateWalletUseCase,
		@inject("IGetWalletByUserUseCase")
		private _getWalletByUserUseCase: IGetWalletByUserUseCase
	) {}

	async execute(
		userId: string,
		role: "client" | "barber",
		transactionId: string
	): Promise<void> {
		const transaction = await this._transactionRepository.findOne({
			transactionId,
		});

		if (!transaction) {
			throw new CustomError(
				ERROR_MESSAGES.WRONG_ID,
				HTTP_STATUS.BAD_REQUEST
			);
		}

		if (transaction.userId !== userId) {
			throw new CustomError(
				ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
				HTTP_STATUS.UNAUTHORIZED
			);
		}

		if (transaction.status !== "success") {
			throw new CustomError(
				ERROR_MESSAGES.INVALID_TRANSACTION,
				HTTP_STATUS.BAD_REQUEST
			);
		}

		let wallet = await this._getWalletByUserUseCase.execute(userId, role);

		wallet.balance += transaction.amount;

		await this._walletRepository.update(
			{ ownerId: userId },
			{ balance: wallet.balance }
		);
	}
}
