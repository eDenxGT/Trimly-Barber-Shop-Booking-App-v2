import { inject, injectable } from "tsyringe";
import { IGetUserDetailsUseCase } from "../../entities/useCaseInterfaces/users/get-user-details-usecase.interface.js";
import { ERROR_MESSAGES, HTTP_STATUS, TRole } from "../../shared/constants.js";
import { UserDTO } from "../../shared/dtos/user.dto.js";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { IBarberEntity } from "../../entities/models/barber.entity.js";
import { IAdminEntity } from "../../entities/models/admin.entity.js";
import { IClientEntity } from "../../entities/models/client.entity.js";

@injectable()
export class GetUserDetailsUseCase implements IGetUserDetailsUseCase {
	constructor(
		@inject("IClientRepository")
		private _clientRepository: IClientRepository,
		@inject("IBarberRepository")
		private _barberRepository: IBarberRepository,
		@inject("IAdminRepository")
		private _adminRepository: IAdminRepository
	) {}

	async execute(
		userId: string,
		role: TRole
	): Promise<IBarberEntity | IAdminEntity | IClientEntity> {
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
		const user = await repository.findOne({ userId });

		if (!user) {
			throw new CustomError(
				ERROR_MESSAGES.USER_NOT_FOUND,
				HTTP_STATUS.NOT_FOUND
			);
		}
		return user;
	}
}
