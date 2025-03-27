import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { IUserExistenceService } from "../../entities/useCaseInterfaces/services/user-existence-service.interface.js";

@injectable()
export class UserExistenceService implements IUserExistenceService {
	constructor(
		@inject("IClientRepository") private _clientRepo: IClientRepository
	) {}

	async emailExists(email: string): Promise<boolean> {
		const [client] = await Promise.all([
			this._clientRepo.findOne({ email }),
		]);

		return Boolean(client);
	}
}
