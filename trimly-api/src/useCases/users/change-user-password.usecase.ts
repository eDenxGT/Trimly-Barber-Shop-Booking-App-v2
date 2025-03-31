import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IChangeUserPasswordUseCase } from "../../entities/useCaseInterfaces/users/change-user-password-usecase.interface.js";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface.js";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";

@injectable()
export class ChangeUserPasswordUseCase implements IChangeUserPasswordUseCase {
	constructor(
		@inject("IClientRepository")
		private _clientRepository: IClientRepository,
		@inject("IBarberRepository")
		private _barberRepository: IBarberRepository,
		@inject("IAdminRepository") private _adminRepository: IAdminRepository,
		@inject("IPasswordBcrypt") private _passwordBcrypt: IBcrypt
	) {}

	async execute({
		oldPassword,
		newPassword,
		email,
		role,
	}: {
		oldPassword: string;
		newPassword: string;
		email: string;
		role: string;
	}): Promise<void> {
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

		const user = await repository.findOne({ email });
		if (!user) {
			throw new CustomError(
				ERROR_MESSAGES.USER_NOT_FOUND,
				HTTP_STATUS.NOT_FOUND
			);
		}

		const isCorrectOldPassword = await this._passwordBcrypt.compare(
			oldPassword,
			user.password
		);

		if (!isCorrectOldPassword) {
			throw new CustomError(
				ERROR_MESSAGES.WRONG_CURRENT_PASSWORD,
				HTTP_STATUS.BAD_REQUEST
			);
		}

		if (oldPassword === newPassword) {
			throw new CustomError(
				ERROR_MESSAGES.SAME_CURR_NEW_PASSWORD,
				HTTP_STATUS.BAD_REQUEST
			);
		}

		const hashedNewPassword = await this._passwordBcrypt.hash(newPassword);
		await repository.update({ email }, { password: hashedNewPassword });
	}
}
