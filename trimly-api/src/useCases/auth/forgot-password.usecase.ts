import { inject, injectable } from "tsyringe";
import { IForgotPasswordUseCase } from "../../entities/useCaseInterfaces/auth/forgot-password-usecase.interface.js";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface.js";
import { ITokenService } from "../../entities/useCaseInterfaces/services/token-service.interface.js";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/redis-token-repository.interface.js";
import { IEmailService } from "../../entities/useCaseInterfaces/services/email-service.interface.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { config } from "../../shared/config.js";

@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
	constructor(
		@inject("IClientRepository")
		private _clientRepository: IClientRepository,
		@inject("IBarberRepository")
		private _barberRepository: IBarberRepository,
		@inject("IAdminRepository") private _adminRepository: IAdminRepository,
		@inject("ITokenService") private _tokenService: ITokenService,
		@inject("IRedisTokenRepository")
		private _redisTokenRepository: IRedisTokenRepository,
		@inject("IEmailService") private _emailService: IEmailService
	) {}

	async execute({
		email,
		role,
	}: {
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
				HTTP_STATUS.FORBIDDEN
			);
		}

		const user = await repository.findOne({ email });
		if (!user) {
			throw new CustomError(
				ERROR_MESSAGES.EMAIL_NOT_FOUND,
				HTTP_STATUS.NOT_FOUND
			);
		}

		const resetToken = this._tokenService.generateResetToken(email);

		try {
			await this._redisTokenRepository.storeResetToken(
				user.userId ?? "",
				resetToken
			);
		} catch (error) {
			console.error("Failed to store reset token in Redis:", error);
			throw new CustomError(
				ERROR_MESSAGES.SERVER_ERROR,
				HTTP_STATUS.INTERNAL_SERVER_ERROR
			);
		}

		const rolePrefix = role !== "client" ? `/${role}` : "";
		const resetUrl = new URL(
			`${rolePrefix}/reset-password/${resetToken}`,
			config.cors.ALLOWED_ORIGIN
		).toString();

		await this._emailService.sendResetEmail(
			email,
			"Trimly - Reset your password",
			resetUrl
		);
	}
}
