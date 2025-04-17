import { IWalletEntity } from "../../../entities/models/wallet.entity.js";
import {
	ERROR_MESSAGES,
	HTTP_STATUS,
	TRole,
} from "../../../shared/constants.js";
import { IGetWalletByUserUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/get-wallet-by-user-usecase.interface.js";
import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/finance/wallet-repository.interface.js";
import { CustomError } from "../../../entities/utils/custom.error.js";
import { ICreateWalletUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/create-wallet-usecase.interface.js";

@injectable()
export class GetWalletByUserUseCase implements IGetWalletByUserUseCase {
	constructor(
		@inject("IWalletRepository")
		private _walletRepository: IWalletRepository,
		@inject("ICreateWalletUseCase")
		private _createWalletUseCase: ICreateWalletUseCase
	) {}
	async execute(
		ownerId: string,
		role: "client" | "barber"
	): Promise<IWalletEntity> {
		let wallet = await this._walletRepository.findOne({ ownerId });

		if (!wallet) {
			wallet = await this._createWalletUseCase.execute({
				ownerId,
				ownerType: role,
			});
			if (!wallet) {
				throw new CustomError(
					ERROR_MESSAGES.WALLET_NOT_FOUND,
					HTTP_STATUS.INTERNAL_SERVER_ERROR
				);
			}
		}
		return wallet;
	}
}
