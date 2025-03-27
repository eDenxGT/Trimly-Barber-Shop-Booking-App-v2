import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { IUserExistenceService } from "../../entities/useCaseInterfaces/services/user-existence-service.interface.js";
import { IBarberShopRepository } from "../../entities/repositoryInterfaces/users/barber-shop-repository.interface.js";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface.js";

@injectable()
export class UserExistenceService implements IUserExistenceService {
	constructor(
		@inject("IBarberShopRepository")
		private _barberRepository: IBarberShopRepository,
		@inject("IClientRepository")
		private _clientRepository: IClientRepository,
		@inject("IAdminRepository") private _adminRepository: IAdminRepository
	) {}

	async emailExists(email: string): Promise<boolean> {
		const [barber, client, admin] = await Promise.all([
			this._barberRepository.findOne({ email }),
			this._clientRepository.findOne({ email }),
			this._adminRepository.findOne({ email }),
		]);

		return Boolean(barber || client || admin);
	}
}
