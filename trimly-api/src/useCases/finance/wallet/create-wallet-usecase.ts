import { inject, injectable } from "tsyringe";
import { ICreateWalletUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/create-wallet-usecase.interface.js";
import { generateUniqueId } from "../../../shared/utils/unique-uuid.helper.js";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/finance/wallet-repository.interface.js";
import { IWalletEntity } from "../../../entities/models/wallet.entity.js";

@injectable()
export class CreateWalletUseCase implements ICreateWalletUseCase {
	constructor(
		@inject("IWalletRepository")
		private _walletRepository: IWalletRepository
	) {}
	async execute({
		ownerId,
		ownerType,
	}: {
		ownerId: string;
		ownerType: "client" | "barber";
	}): Promise<IWalletEntity | null> {
		return await this._walletRepository.save({
			walletId: generateUniqueId("wallet"),
			ownerId,
			ownerType,
			balance: 0,
			currency: "INR",
		});
	}
}
