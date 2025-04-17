import { IWalletEntity } from "../../models/wallet.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IWalletRepository extends IBaseRepository<IWalletEntity> {
	incrementBalance(
		ownerId: string,
		amount: number
	): Promise<IWalletEntity | null>;
	decrementBalance(
		ownerId: string,
		amount: number
	): Promise<IWalletEntity | null>;
}
