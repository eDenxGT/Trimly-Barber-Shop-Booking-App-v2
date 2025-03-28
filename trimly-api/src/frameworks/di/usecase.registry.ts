//* ====== Module Imports ====== *//
import { container } from "tsyringe";

//* ====== Bcrypt Imports ====== *//
import { IBcrypt } from "../security/bcrypt.interface.js";
import { PasswordBcrypt } from "../security/password.bcrypt.js";

//* ====== Service Imports ====== *//
import { IUserExistenceService } from "../../entities/useCaseInterfaces/services/user-existence-service.interface.js";
import { UserExistenceService } from "../../useCases/services/user-existence.service.js";

//* ====== UseCase Imports ====== *//
import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/register-usecase.interface.js";
import { RegisterUserUseCase } from "../../useCases/auth/register-user.usecase.js";
import { ISendOtpEmailUseCase } from "../../entities/useCaseInterfaces/auth/sent-otp-usecase.interface.js";
import { SendOtpEmailUseCase } from "../../useCases/auth/send-otp-email.usecase.js";
import { IVerifyOtpUseCase } from "../../entities/useCaseInterfaces/auth/verify-otp-usecase.interface.js";
import { VerifyOtpUseCase } from "../../useCases/auth/verify-otp.usecase.js";
import { IOtpService } from "../../entities/useCaseInterfaces/services/otp-service.interface.js";
import { OtpService } from "../../useCases/services/otp.service.js";
import { OtpBcrypt } from "../security/otp.bcrypt.js";
import { IEmailService } from "../../entities/useCaseInterfaces/services/email-service.interface.js";
import { EmailService } from "../../useCases/services/email.service.js";
import { ILoginUserUseCase } from "../../entities/useCaseInterfaces/auth/login-usecase.interface.js";
import { LoginUserUseCase } from "../../useCases/auth/login-user.usecase.js";
import { ITokenService } from "../../entities/useCaseInterfaces/services/token-service.interface.js";
import { JWTService } from "../../useCases/services/jwt.service.js";
import { IRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/refresh-token-usecase.interface.js";
import { RefreshTokenUseCase } from "../../useCases/auth/refresh-token.usecase.js";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/auth/generate-token-usecase.interface.js";
import { GenerateTokenUseCase } from "../../useCases/auth/generate-token.usecase.js";
import { IRevokeRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/revoke-refresh-token-usecase.interface.js";
import { RevokeRefreshTokenUseCase } from "../../useCases/auth/revoke-refresh-token.usecase.js";
import { IBlackListTokenUseCase } from "../../entities/useCaseInterfaces/auth/blacklist-token-usecase.interface.js";
import { BlackListTokenUseCase } from "../../useCases/auth/blacklist-token.usecase.js";

export class UseCaseRegistry {
	static registerUseCases(): void {
		//* ====== Register UseCases ====== *//
		container.register<IRegisterUserUseCase>("IRegisterUserUseCase", {
			useClass: RegisterUserUseCase,
		});

		container.register<ISendOtpEmailUseCase>("ISendOtpEmailUseCase", {
			useClass: SendOtpEmailUseCase,
		});

		container.register<IVerifyOtpUseCase>("IVerifyOtpUseCase", {
			useClass: VerifyOtpUseCase,
		});

		container.register<ILoginUserUseCase>("ILoginUserUseCase", {
			useClass: LoginUserUseCase,
		});

		container.register<IRefreshTokenUseCase>("IRefreshTokenUseCase", {
			useClass: RefreshTokenUseCase,
		});

		container.register<IGenerateTokenUseCase>("IGenerateTokenUseCase", {
			useClass: GenerateTokenUseCase,
		});

		container.register<IRevokeRefreshTokenUseCase>(
			"IRevokeRefreshTokenUseCase",
			{
				useClass: RevokeRefreshTokenUseCase,
			}
		);

		container.register<IBlackListTokenUseCase>("IBlackListTokenUseCase", {
			useClass: BlackListTokenUseCase,
		});

		//* ====== Register Bcrypts ====== *//
		container.register<IBcrypt>("IPasswordBcrypt", {
			useClass: PasswordBcrypt,
		});

		container.register<IBcrypt>("IOtpBcrypt", {
			useClass: OtpBcrypt,
		});

		//* ====== Register Services ====== *//
		container.register<IUserExistenceService>("IUserExistenceService", {
			useClass: UserExistenceService,
		});

		container.register<IOtpService>("IOtpService", {
			useClass: OtpService,
		});

		container.register<IEmailService>("IEmailService", {
			useClass: EmailService,
		});

		container.register<ITokenService>("ITokenService", {
			useClass: JWTService,
		});
	}
}
