import { IWalletEntity } from "../../../models/wallet.entity.js";

export interface IIncrementWalletBalanceUseCase {
	execute({
		ownerId,
		amount,
		role,
	}: {
		ownerId: string;
		amount: number;
		role: "client" | "barber";
	}): Promise<IWalletEntity>;
}
