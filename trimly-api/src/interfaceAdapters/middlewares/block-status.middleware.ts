import { inject, injectable } from "tsyringe";
import { clearAuthCookies } from "../../shared/utils/cookie.helper.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { CustomRequest } from "./auth.middleware.js";
import { NextFunction, Response } from "express";
import { IBlackListTokenUseCase } from "../../entities/useCaseInterfaces/auth/blacklist-token-usecase.interface.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { IRevokeRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/revoke-refresh-token-usecase.interface.js";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface.js";
import { CustomError } from "../../entities/utils/custom.error.js";

@injectable()
export class BlockStatusMiddleware {
	constructor(
		@inject("IClientRepository")
		private readonly _clientRepository: IClientRepository,
		@inject("IBarberRepository")
		private readonly _barberRepository: IBarberRepository,
		@inject("IAdminRepository")
		private readonly _adminRepository: IAdminRepository,
		@inject("IBlackListTokenUseCase")
		private readonly _blacklistTokenUseCase: IBlackListTokenUseCase,
		@inject("IRevokeRefreshTokenUseCase")
		private readonly _revokeRefreshTokenUseCase: IRevokeRefreshTokenUseCase
	) {}
	private async getUserStatus(userId: string, role: string) {
		const repo =
			{
				client: this._clientRepository,
				barber: this._barberRepository,
				admin: this._adminRepository,
			}[role] || null;

		if (!repo) {
			throw new CustomError(
				ERROR_MESSAGES.INVALID_ROLE,
				HTTP_STATUS.BAD_REQUEST
			);
		}

		const user = await repo.findOne({ userId });
		return user?.status;
	}

	checkStatus = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction
	) => {
		try {
			if (!req.user) {
				return res.status(HTTP_STATUS.UNAUTHORIZED).json({
					status: "error",
					message: "Unauthorized: No user found in request",
				});
			}

			const { userId, role, access_token, refresh_token } = req.user;
			if (!["client", "barber", "admin"].includes(role)) {
				return res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					message: ERROR_MESSAGES.INVALID_ROLE,
				});
			}

			const status = await this.getUserStatus(userId, role);
			if (!status) {
				return res.status(HTTP_STATUS.NOT_FOUND).json({
					success: false,
					message: ERROR_MESSAGES.USER_NOT_FOUND,
				});
			}

			if (status === "blocked") {
				await Promise.all([
					this._blacklistTokenUseCase.execute(access_token),
					this._revokeRefreshTokenUseCase.execute(refresh_token),
				]);
				clearAuthCookies(
					res,
					`${role}_access_token`,
					`${role}_refresh_token`
				);

				return res.status(HTTP_STATUS.FORBIDDEN).json({
					success: false,
					message: "Access denied: Your account has been blocked",
				});
			}

			next();
		} catch (error) {
			console.error("Block Status Middleware Error:", error);
			res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: "Internal server error while checking blocked status",
			});
		}
	};
}
