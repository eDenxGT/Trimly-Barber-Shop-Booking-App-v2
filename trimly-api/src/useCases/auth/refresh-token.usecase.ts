import { inject, injectable } from "tsyringe";
import { JwtPayload } from "jsonwebtoken";
import { IRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/refresh-token-usecase.interface.js";
import { ITokenService } from "../../entities/useCaseInterfaces/services/token-service.interface.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
	constructor(
		@inject("ITokenService") private _tokenService: ITokenService
	) {}
	execute(refreshToken: string): { role: string; accessToken: string } {
		const payload = this._tokenService.verifyRefreshToken(refreshToken);
		if (!payload) {
			throw new CustomError(
				ERROR_MESSAGES.INVALID_TOKEN,
				HTTP_STATUS.BAD_REQUEST
			);
		}
		return {
			role: (payload as JwtPayload).role,
			accessToken: this._tokenService.generateAccessToken({
				userId: (payload as JwtPayload).userId,
				email: (payload as JwtPayload).email,
				role: (payload as JwtPayload).role,
			}),
		};
	}
}
