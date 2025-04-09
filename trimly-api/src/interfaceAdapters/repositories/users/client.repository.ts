import { injectable } from "tsyringe";
import {
	ClientModel,
	IClientModel,
} from "../../../frameworks/database/mongoDb/models/client.model.js";
import { BaseRepository } from "../base.repository.js";
import { IClientRepository } from "../../../entities/repositoryInterfaces/users/client-repository.interface.js";

@injectable()
export class ClientRepository
	extends BaseRepository<IClientModel>
	implements IClientRepository
{
	constructor() {
		super(ClientModel);
	}

	async updateWallet(userId: string, amount: number): Promise<void> {
		if (!amount || isNaN(amount)) return;

		await ClientModel.updateOne(
			{ userId },
			{ $inc: { walletBalance: amount } }
		);
	}
}
