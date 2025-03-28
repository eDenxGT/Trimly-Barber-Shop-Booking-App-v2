// import { OAuth2Client } from "google-auth-library";
// import { inject, injectable } from "tsyringe";
// import { IGoogleUseCase } from "../../entities/useCaseInterfaces/auth/google-usecase.js";
// import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/register-usecase.interface.js";
// import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
// import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
// import { IBarberEntity } from "../../entities/models/barber.entity.js";
// import { IClientEntity } from "../../entities/models/client.entity.js";
// import { ERROR_MESSAGES, HTTP_STATUS, TRole } from "../../shared/constants.js";
// import { CustomError } from "../../entities/utils/custom.error.js";
// import { UserDTO } from "../../shared/dtos/user.dto.js";

// @injectable()
// export class GoogleUseCase implements IGoogleUseCase {
// 	private _oAuthClient: OAuth2Client;
// 	constructor(
// 		@inject("IRegisterUserUseCase")
// 		private _registerUserUseCase: IRegisterUserUseCase,
// 		@inject("IClientRepository")
// 		private _clientRepository: IClientRepository,
// 		@inject("IBarberRepository")
// 		private _barberRepository: IBarberRepository
// 	) {
// 		this._oAuthClient = new OAuth2Client();
// 	}

// 	async execute(
// 		credential: string,
// 		client_id: string,
// 		role: TRole
// 	): Promise<Partial<IBarberEntity | IClientEntity>> {
// 		const ticket = await this._oAuthClient.verifyIdToken({
// 			idToken: credential,
// 			audience: client_id,
// 		});

// 		const payload = ticket.getPayload();
// 		if (!payload) {
// 			throw new CustomError(
// 				"Invalid or empty token payload",
// 				HTTP_STATUS.UNAUTHORIZED
// 			);
// 		}

// 		const googleId = payload.sub;
// 		const email = payload.email;
// 		const firstName = payload.given_name || "";
// 		const lastName = payload.family_name || "";
// 		const profileImage = payload.picture || "";

// 		if (!email) {
// 			throw new CustomError("Email is required", HTTP_STATUS.BAD_REQUEST);
// 		}

// 		let repository;
// 		if (role === "client") {
// 			repository = this._clientRepository;
// 		} else if (role === "barber") {
// 			repository = this._barberRepository;
// 		} else {
// 			throw new CustomError(
// 				ERROR_MESSAGES.INVALID_ROLE,
// 				HTTP_STATUS.BAD_REQUEST
// 			);
// 		}

// 		const existingUser = await repository.findOne({ email });

// 		if (existingUser && existingUser.status !== "active") {
// 			throw new CustomError(
// 				ERROR_MESSAGES.BLOCKED,
// 				HTTP_STATUS.FORBIDDEN
// 			);
// 		}

// 		if (existingUser) return existingUser;

// 		const newUser = await this._registerUserUseCase.execute({
// 			fullName,
// 			role,
// 			googleId,
// 			email,
// 			profileImage,
// 		} as UserDTO);

// 		if (!newUser) {
// 			throw new CustomError(
// 				"Registration failed",
// 				HTTP_STATUS.INTERNAL_SERVER_ERROR
// 			);
// 		}

// 		return newUser;
// 	}
// }
