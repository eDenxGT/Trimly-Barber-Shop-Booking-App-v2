import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { userSchemas } from "./validations/user-signup.validation.schema.js";
import { IAuthController } from "../../../entities/controllerInterfaces/users/auth-controller.interface.js";
import { IRegisterUserUseCase } from "../../../entities/useCaseInterfaces/auth/register-usecase.interface.js";
import {
	ERROR_MESSAGES,
	HTTP_STATUS,
	SUCCESS_MESSAGES,
	TRole,
} from "../../../shared/constants.js";
import { handleErrorResponse } from "../../../shared/utils/error.handler.js";
import { IVerifyOtpUseCase } from "../../../entities/useCaseInterfaces/auth/verify-otp-usecase.interface.js";
import { ISendOtpEmailUseCase } from "../../../entities/useCaseInterfaces/auth/sent-otp-usecase.interface.js";
import { otpMailValidationSchema } from "./validations/otp-mail.validation.schema.js";
import {
	clearAuthCookies,
	setAuthCookies,
	updateCookieWithAccessToken,
} from "../../../shared/utils/cookie.helper.js";
import { loginSchema } from "./validations/user-login.validation.schema.js";
import { LoginUserDTO } from "../../../shared/dtos/user.dto.js";
import { ILoginUserUseCase } from "../../../entities/useCaseInterfaces/auth/login-usecase.interface.js";
import { CustomRequest } from "../../middlewares/auth.middleware.js";
import { IRefreshTokenUseCase } from "../../../entities/useCaseInterfaces/auth/refresh-token-usecase.interface.js";
import { IBlackListTokenUseCase } from "../../../entities/useCaseInterfaces/auth/blacklist-token-usecase.interface.js";
import { IRevokeRefreshTokenUseCase } from "../../../entities/useCaseInterfaces/auth/revoke-refresh-token-usecase.interface.js";
import { IGenerateTokenUseCase } from "../../../entities/useCaseInterfaces/auth/generate-token-usecase.interface.js";
import { IResetPasswordUseCase } from "../../../entities/useCaseInterfaces/auth/reset-password-usecase.interface.js";
import { IForgotPasswordUseCase } from "../../../entities/useCaseInterfaces/auth/forgot-password-usecase.interface.js";
import { forgotPasswordValidationSchema } from "./validations/forgot-password.validation.schema.js";
import { resetPasswordValidationSchema } from "./validations/reset-password.validation.schema.js";
import { IGoogleUseCase } from "../../../entities/useCaseInterfaces/auth/google-usecase.js";
import { IGetUserDetailsUseCase } from "../../../entities/useCaseInterfaces/users/get-user-details-usecase.interface.js";

@injectable()
export class AuthController implements IAuthController {
	constructor(
		@inject("IRegisterUserUseCase")
		private _registerUserUseCase: IRegisterUserUseCase,
		@inject("IVerifyOtpUseCase")
		private _verifyOtpUseCase: IVerifyOtpUseCase,
		@inject("ISendOtpEmailUseCase")
		private _sendOtpEmailUseCase: ISendOtpEmailUseCase,
		@inject("ILoginUserUseCase")
		private _loginUserUseCase: ILoginUserUseCase,
		@inject("IRefreshTokenUseCase")
		private _refreshTokenUseCase: IRefreshTokenUseCase,
		@inject("IBlackListTokenUseCase")
		private _blackListTokenUseCase: IBlackListTokenUseCase,
		@inject("IRevokeRefreshTokenUseCase")
		private _revokeRefreshToken: IRevokeRefreshTokenUseCase,
		@inject("IGenerateTokenUseCase")
		private _generateTokenUseCase: IGenerateTokenUseCase,
		@inject("IForgotPasswordUseCase")
		private _forgotPasswordUseCase: IForgotPasswordUseCase,
		@inject("IGoogleUseCase") private _googleUseCase: IGoogleUseCase,
		@inject("IResetPasswordUseCase")
		private _resetPasswordUseCase: IResetPasswordUseCase,
	) {}

	//* ─────────────────────────────────────────────────────────────
	//*                     🛠️ User Register
	//* ─────────────────────────────────────────────────────────────
	async register(req: Request, res: Response): Promise<void> {
		try {
			const { role } = req.body as { role: keyof typeof userSchemas };
			const schema = userSchemas[role];
			if (!schema) {
				res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					message: ERROR_MESSAGES.INVALID_CREDENTIALS,
				});
				return;
			}
			const validatedData = schema.parse(req.body);
			await this._registerUserUseCase.execute(validatedData);
			if (role === "barber") {
				res.status(HTTP_STATUS.CREATED).json({
					success: true,
					message: SUCCESS_MESSAGES.LOGIN_AND_COMPLETE_YOUR_PROFILE,
				});
				return;
			}
			res.status(HTTP_STATUS.CREATED).json({
				success: true,
				message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                     🛠️ User Login
	//* ─────────────────────────────────────────────────────────────
	async login(req: Request, res: Response): Promise<void> {
		try {
			const data = req.body as LoginUserDTO;
			const validatedData = loginSchema.parse(data);
			if (!validatedData) {
				res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					message: ERROR_MESSAGES.INVALID_CREDENTIALS,
				});
			}
			const user = await this._loginUserUseCase.execute(validatedData);

			if (!user.userId || !user.email || !user.role) {
				throw new Error("User ID, email, or role is missing");
			}

			const tokens = await this._generateTokenUseCase.execute(
				user.userId as string,
				user.email,
				user.role
			);

			const accessTokenName = `${user.role}_access_token`;
			const refreshTokenName = `${user.role}_refresh_token`;

			setAuthCookies(
				res,
				tokens.accessToken,
				tokens.refreshToken,
				accessTokenName,
				refreshTokenName
			);

			const { password, ...userWithoutPassword } = user;

			if (
				userWithoutPassword.status === "pending" &&
				userWithoutPassword.role === "barber"
			) {
				res.status(HTTP_STATUS.OK).json({
					success: true,
					message:
						SUCCESS_MESSAGES.COMPLETE_YOUR_PROFILE_TO_GET_APPROVED,
					user: {
						...userWithoutPassword,
					},
				});
				return;
			}

			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
				user: {
					...userWithoutPassword,
				},
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                  🛠️ Google Authentication
	//* ─────────────────────────────────────────────────────────────
	async authenticateWithGoogle(req: Request, res: Response): Promise<void> {
		try {
			const { credential, client_id, role } = req.body;
			const user = await this._googleUseCase.execute(
				credential,
				client_id,
				role
			);
			if (!user.userId || !user.email || !user.role) {
				throw new Error("User ID, email, or role is missing");
			}

			const tokens = await this._generateTokenUseCase.execute(
				user.userId,
				user.email,
				user.role
			);

			const accessTokenName = `${user.role}_access_token`;
			const refreshTokenName = `${user.role}_refresh_token`;

			setAuthCookies(
				res,
				tokens.accessToken,
				tokens.refreshToken,
				accessTokenName,
				refreshTokenName
			);
			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
				user: user,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                     🛠️ User Logout
	//* ─────────────────────────────────────────────────────────────
	async logout(req: Request, res: Response): Promise<void> {
		try {
			await this._blackListTokenUseCase.execute(
				(req as CustomRequest).user.access_token
			);

			await this._revokeRefreshToken.execute(
				(req as CustomRequest).user.refresh_token
			);

			const user = (req as CustomRequest).user;
			const accessTokenName = `${user.role}_access_token`;
			const refreshTokenName = `${user.role}_refresh_token`;
			clearAuthCookies(res, accessTokenName, refreshTokenName);
			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                  🛠️ User Forgot Password
	//* ─────────────────────────────────────────────────────────────
	async forgotPassword(req: Request, res: Response): Promise<void> {
		try {
			const validatedData = forgotPasswordValidationSchema.parse(
				req.body
			);
			if (!validatedData) {
				res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					message: ERROR_MESSAGES.VALIDATION_ERROR,
				});
			}
			await this._forgotPasswordUseCase.execute(validatedData);

			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.EMAIL_SENT_SUCCESSFULLY,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                    🛠️ User Reset Password
	//* ─────────────────────────────────────────────────────────────
	async resetPassword(req: Request, res: Response): Promise<void> {
		try {
			const validatedData = resetPasswordValidationSchema.parse(req.body);
			if (!validatedData) {
				res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					message: ERROR_MESSAGES.VALIDATION_ERROR,
				});
			}

			await this._resetPasswordUseCase.execute(validatedData);
			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                 🛠️ Token Refresh Handler
	//* ─────────────────────────────────────────────────────────────
	handleTokenRefresh(req: Request, res: Response): void {
		try {
			const refreshToken = (req as CustomRequest).user.refresh_token;
			const newTokens = this._refreshTokenUseCase.execute(refreshToken);
			const accessTokenName = `${newTokens.role}_access_token`;
			updateCookieWithAccessToken(
				res,
				newTokens.accessToken,
				accessTokenName
			);
			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
			});
		} catch (error) {
			clearAuthCookies(
				res,
				`${(req as CustomRequest).user.role}_access_token`,
				`${(req as CustomRequest).user.role}_refresh_token`
			);
			res.status(HTTP_STATUS.UNAUTHORIZED).json({
				message: ERROR_MESSAGES.INVALID_TOKEN,
			});
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                     🛠️ Sent Otp Email
	//* ─────────────────────────────────────────────────────────────
	async sendOtpEmail(req: Request, res: Response): Promise<void> {
		try {
			const { email } = req.body;
			await this._sendOtpEmailUseCase.execute(email);
			res.status(HTTP_STATUS.OK).json({
				message: SUCCESS_MESSAGES.OTP_SEND_SUCCESS,
				success: true,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                      🛠️ Verify Otp
	//* ─────────────────────────────────────────────────────────────
	async verifyOtp(req: Request, res: Response): Promise<void> {
		try {
			const { email, otp } = req.body;
			const validatedData = otpMailValidationSchema.parse({ email, otp });
			await this._verifyOtpUseCase.execute(validatedData);

			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.VERIFICATION_SUCCESS,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}
}
