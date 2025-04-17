import { IWalletEntity } from "../../../models/wallet.entity.js";

export interface ICreateWalletUseCase {
	execute({
		ownerId,
		ownerType,
	}: {
		ownerId: string;
		ownerType: "client" | "barber";
	}): Promise<IWalletEntity | null>;
}
