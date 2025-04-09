import { IClientEntity } from "../../models/client.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IClientRepository extends IBaseRepository<IClientEntity> {
	updateWallet(userId: string, amount: number): Promise<void>;
}
