import { inject, injectable } from "tsyringe";
import { IIncrementWalletBalanceUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/increment-wallet-balance-usecase.interface.js";
import { IWalletEntity } from "../../../entities/models/wallet.entity.js";
import { IGetWalletByUserUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/get-wallet-by-user-usecase.interface.js";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/finance/wallet-repository.interface.js";
import { CustomError } from "../../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";

@injectable()
export class IncrementWalletBalanceUseCase
	implements IIncrementWalletBalanceUseCase
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
		const hasWallet = await this._getWalletByUserUseCase.execute(
			ownerId,
			role
		);

		if (!hasWallet) {
			throw new CustomError(
				ERROR_MESSAGES.WALLET_NOT_FOUND,
				HTTP_STATUS.NOT_FOUND
			);
		}
		const updatedWallet = await this._walletRepository.incrementBalance(
			ownerId,
			amount
		);
		if (!updatedWallet) {
			throw new CustomError(
				ERROR_MESSAGES.WALLET_UPDATE_FAILED,
				HTTP_STATUS.NOT_FOUND
			);
		}
		return updatedWallet;
	}
}
