import { inject, injectable } from "tsyringe";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/auth/generate-token-usecase.interface.js";
import { ITokenService } from "../../entities/useCaseInterfaces/services/token-service.interface.js";
import { IRefreshTokenRepository } from "../../entities/repositoryInterfaces/auth/refresh-token-repository.interface.js";
import { TRole } from "../../shared/constants.js";

@injectable()
export class GenerateTokenUseCase implements IGenerateTokenUseCase {
	constructor(
		@inject("ITokenService") private _tokenService: ITokenService,
		@inject("IRefreshTokenRepository")
		private _refreshTokenRepository: IRefreshTokenRepository
	) {}
	async execute(
		userId: string,
		email: string,
		role: string
	): Promise<{ accessToken: string; refreshToken: string }> {
		const payload = { email, userId, role };

		const accessToken = this._tokenService.generateAccessToken(payload);
		const refreshToken = this._tokenService.generateRefreshToken(payload);

		await this._refreshTokenRepository.save({
			token: refreshToken,
			userType: role as TRole,
			user: userId,
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});

		return {
			accessToken,
			refreshToken,
		};
	}
}
