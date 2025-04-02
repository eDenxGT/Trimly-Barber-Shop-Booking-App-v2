import { OAuth2Client } from "google-auth-library";
import { inject, injectable } from "tsyringe";
import { IGoogleUseCase } from "../../entities/useCaseInterfaces/auth/google-usecase.js";
import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/register-usecase.interface.js";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IBarberEntity } from "../../entities/models/barber.entity.js";
import { IClientEntity } from "../../entities/models/client.entity.js";
import {
	ERROR_MESSAGES,
	GOOGLE_REGISTRATION_MAIL_CONTENT,
	HTTP_STATUS,
	TRole,
} from "../../shared/constants.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ClientDTO } from "../../shared/dtos/user.dto.js";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface.js";
import { generateRandomPassword } from "../../shared/utils/random-password.helper.js";
import { ISendEmailUseCase } from "../../entities/useCaseInterfaces/common/send-email-usecase.interface.js";

@injectable()
export class GoogleUseCase implements IGoogleUseCase {
	private _oAuthClient: OAuth2Client;
	constructor(
		@inject("IRegisterUserUseCase")
		private _registerUserUseCase: IRegisterUserUseCase,
		@inject("IClientRepository")
		private _clientRepository: IClientRepository,
		@inject("IBarberRepository")
		private _barberRepository: IBarberRepository,
		@inject("IPasswordBcrypt") private _passwordBcrypt: IBcrypt,
		@inject("ISendEmailUseCase")
		private _sendEmailUseCase: ISendEmailUseCase
	) {
		this._oAuthClient = new OAuth2Client();
	}

	async execute(
		credential: string,
		client_id: string,
		role: TRole
	): Promise<Partial<IBarberEntity | IClientEntity>> {
		const ticket = await this._oAuthClient.verifyIdToken({
			idToken: credential,
			audience: client_id,
		});

		const payload = ticket.getPayload();
		if (!payload) {
			throw new CustomError(
				"Invalid or empty token payload",
				HTTP_STATUS.UNAUTHORIZED
			);
		}

		const googleId = payload.sub;
		const email = payload.email;
		const avatar = payload.picture || "";
		const fullName = payload.given_name || payload.family_name || "";

		if (!email) {
			throw new CustomError("Email is required", HTTP_STATUS.BAD_REQUEST);
		}

		let repository;
		if (role === "client") {
			repository = this._clientRepository;
		} else if (role === "barber") {
			repository = this._barberRepository;
		} else {
			throw new CustomError(
				ERROR_MESSAGES.INVALID_ROLE,
				HTTP_STATUS.BAD_REQUEST
			);
		}

		const existingUser = await repository.findOne({ email });

		if (existingUser) {
			if (existingUser.status !== "active") {
				if (existingUser.status === "pending") {
					throw new CustomError(
						ERROR_MESSAGES.ACCOUNT_UNDER_VERIFICATION,
						HTTP_STATUS.FORBIDDEN
					);
				}
				throw new CustomError(
					ERROR_MESSAGES.BLOCKED,
					HTTP_STATUS.FORBIDDEN
				);
			}
			return existingUser;
		}

		if (role === "barber") {
			throw new CustomError(
				"Barber Shop accounts cannot be created using Google. Please Register First.",
				HTTP_STATUS.FORBIDDEN
			);
		}

		const tempPassword = (
			await generateRandomPassword(fullName, email)
		).trim();

		const userData: ClientDTO = {
			fullName,
			role,
			googleId,
			email,
			avatar,
			phoneNumber: "",
			password: tempPassword,
		};

		const newUser = await this._registerUserUseCase.execute(
			userData,
			"google"
		);

		if (!newUser) {
			throw new CustomError(
				"Registration failed",
				HTTP_STATUS.INTERNAL_SERVER_ERROR
			);
		}

		this._sendEmailUseCase.execute(
			email,
			"Welcome to Trimly! Your Google Registration is Complete 🎉",
			GOOGLE_REGISTRATION_MAIL_CONTENT(fullName, tempPassword)
		);

		return newUser;
	}
}
