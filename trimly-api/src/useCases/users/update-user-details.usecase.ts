import { inject, injectable } from "tsyringe";
import { IUpdateUserDetailsUseCase } from "../../entities/useCaseInterfaces/users/update-user-details-usecase.interface.js";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface.js";
import { IAdminEntity } from "../../entities/models/admin.entity.js";
import { IClientEntity } from "../../entities/models/client.entity.js";
import { IBarberEntity } from "../../entities/models/barber.entity.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";

@injectable()
export class UpdateUserDetailsUseCase implements IUpdateUserDetailsUseCase {
	constructor(
		@inject("IClientRepository")
		private _clientRepository: IClientRepository,
		@inject("IBarberRepository")
		private _barberRepository: IBarberRepository,
		@inject("IAdminRepository") private _adminRepository: IAdminRepository
	) {}
	async execute(
		userId: string,
		role: string,
		userDetails: Record<string, any>
	): Promise<IAdminEntity | IClientEntity | IBarberEntity | null> {
		let repository;

		if (role === "client") {
			repository = this._clientRepository;
		} else if (role === "barber") {
			repository = this._barberRepository;
		} else if (role === "admin") {
			repository = this._adminRepository;
		} else {
			throw new CustomError(
				ERROR_MESSAGES.INVALID_ROLE,
				HTTP_STATUS.BAD_REQUEST
			);
		}
		const user = await repository.update({ userId }, userDetails);
		console.log(role, user)

		if (!user) {
			console.log("No suer")
			// throw new CustomError(
			// 	ERROR_MESSAGES.USER_NOT_FOUND,
			// 	HTTP_STATUS.NOT_FOUND
			// );
		}
		return user;
	}
}
