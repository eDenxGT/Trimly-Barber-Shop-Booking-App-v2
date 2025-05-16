import { inject, injectable } from "tsyringe";
import { LoginUserDTO } from "../../shared/dtos/user.dto.js";
import { IBarberEntity } from "../../entities/models/barber.entity.js";
import { IAdminEntity } from "../../entities/models/admin.entity.js";
import { IClientEntity } from "../../entities/models/client.entity.js";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { ILoginUserUseCase } from "../../entities/useCaseInterfaces/auth/login-usecase.interface.js";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";

@injectable()
export class LoginUserUseCase implements ILoginUserUseCase {
	constructor(
		@inject("IClientRepository")
		private _clientRepository: IClientRepository,
		@inject("IBarberRepository")
		private _barberRepository: IBarberRepository,
		@inject("IAdminRepository") private _adminRepository: IAdminRepository,
		@inject("IPasswordBcrypt") private _passwordBcrypt: IBcrypt
	) {}

	async execute(
		user: LoginUserDTO
	): Promise<Partial<IBarberEntity | IAdminEntity | IClientEntity>> {
		let repository;

		if (user.role === "client") {
			repository = this._clientRepository;
		} else if (user.role === "barber") {
			repository = this._barberRepository;
		} else if (user.role === "admin") {
			repository = this._adminRepository;
		} else {
			throw new CustomError(
				ERROR_MESSAGES.INVALID_ROLE,
				HTTP_STATUS.BAD_REQUEST
			);
		}

		const userData = await repository.findOne({ email: user.email });
		if (!userData) {
			throw new CustomError(
				ERROR_MESSAGES.USER_NOT_FOUND,
				HTTP_STATUS.NOT_FOUND
			);
		}

		// if (userData.status === "pending") {
		// 	throw new CustomError(
		// 		ERROR_MESSAGES.ACCOUNT_UNDER_VERIFICATION,
		// 		HTTP_STATUS.FORBIDDEN
		// 	);
		// }
      
		if (userData.status === "blocked") {
			throw new CustomError(
				ERROR_MESSAGES.BLOCKED,
				HTTP_STATUS.FORBIDDEN
			);
		}

		if (user.password) {
			const isPasswordMatch = await this._passwordBcrypt.compare(
				user.password,
				userData.password
			);
			if (!isPasswordMatch) {
				throw new CustomError(
					ERROR_MESSAGES.INVALID_CREDENTIALS,
					HTTP_STATUS.FORBIDDEN
				);
			}
		}

		return userData;
	}
}
