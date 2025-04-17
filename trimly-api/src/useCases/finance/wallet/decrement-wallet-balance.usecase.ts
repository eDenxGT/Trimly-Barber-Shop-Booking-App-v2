import { inject, injectable } from "tsyringe";
import { IWalletEntity } from "../../../entities/models/wallet.entity.js";
import { IGetWalletByUserUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/get-wallet-by-user-usecase.interface.js";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/finance/wallet-repository.interface.js";
import { CustomError } from "../../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";
import { IDecrementWalletBalanceUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/decrement-wallet-balance-usecase.interface.js";

@injectable()
export class DecrementWalletBalanceUseCase
	implements IDecrementWalletBalanceUseCase
{
	constructor(
		@inject("IGetWalletByUserUseCase")
		private _getWalletByUserUseCase: IGetWalletByUserUseCase,
		@inject("IWalletRepository")
		private _walletRepository: IWalletRepository
	) {}

	async execute({
		ownerId,
		amount,
		role,
	}: {
		ownerId: string;
		amount: number;
		role: "client" | "barber";
	}): Promise<IWalletEntity> {
		const wallet = await this._getWalletByUserUseCase.execute(
			ownerId,
			role
		);

		if (!wallet) {
			throw new CustomError(
				ERROR_MESSAGES.WALLET_NOT_FOUND,
				HTTP_STATUS.NOT_FOUND
			);
		}

		if (wallet.balance < amount) {
			throw new CustomError(
				ERROR_MESSAGES.INSUFFICIENT_BALANCE,
				HTTP_STATUS.BAD_REQUEST
			);
		}

		const updatedWallet = await this._walletRepository.decrementBalance(
			ownerId,
			amount
		);

		if (!updatedWallet) {
			throw new CustomError(
				ERROR_MESSAGES.WALLET_UPDATE_FAILED,
				HTTP_STATUS.INTERNAL_SERVER_ERROR
			);
		}

		return updatedWallet;
	}
}
