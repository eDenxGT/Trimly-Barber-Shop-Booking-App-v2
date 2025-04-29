import { inject, injectable } from "tsyringe";
import { IResetPasswordUseCase } from "../../entities/useCaseInterfaces/auth/reset-password-usecase.interface.js";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface.js";
import { ITokenService } from "../../entities/serviceInterfaces/token-service.interface.js";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/redis-token-repository.interface.js";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface.js";
import { ResetTokenPayload } from "../../interfaceAdapters/services/jwt.service.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
	constructor(
		@inject("IClientRepository")
		private _clientRepository: IClientRepository,
		@inject("IBarberRepository")
		private _barberRepository: IBarberRepository,
		@inject("IAdminRepository") private _adminRepository: IAdminRepository,
		@inject("ITokenService") private _tokenService: ITokenService,
		@inject("IRedisTokenRepository")
		private _redisTokenRepository: IRedisTokenRepository,
		@inject("IPasswordBcrypt") private _passwordBcrypt: IBcrypt
	) {}

	async execute({
		password,
		role,
		token,
	}: {
		password: string;
		role: string;
		token: string;
	}): Promise<void> {
		const payload = this._tokenService.verifyResetToken(
			token
		) as ResetTokenPayload;
		if (!payload || !payload.email) {
			throw new CustomError(
				ERROR_MESSAGES.INVALID_TOKEN,
				HTTP_STATUS.BAD_REQUEST
			);
		}

		const email = payload.email;
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
				HTTP_STATUS.FORBIDDEN
			);
		}

		const user = await repository.findOne({ email });
		if (!user) {
			throw new CustomError(
				ERROR_MESSAGES.USER_NOT_FOUND,
				HTTP_STATUS.NOT_FOUND
			);
		}

		const tokenValid = await this._redisTokenRepository.verifyResetToken(
			user.userId ?? "",
			token
		);
		if (!tokenValid) {
			throw new CustomError(
				ERROR_MESSAGES.INVALID_TOKEN,
				HTTP_STATUS.BAD_REQUEST
			);
		}

		const isSamePasswordAsOld = await this._passwordBcrypt.compare(
			password,
			user.password
		);
		if (isSamePasswordAsOld) {
			throw new CustomError(
				ERROR_MESSAGES.SAME_CURR_NEW_PASSWORD,
				HTTP_STATUS.BAD_REQUEST
			);
		}

		const hashedPassword = await this._passwordBcrypt.hash(password);

		await repository.update({ email }, { password: hashedPassword });

		await this._redisTokenRepository.deleteResetToken(user.userId ?? "");
	}
}
