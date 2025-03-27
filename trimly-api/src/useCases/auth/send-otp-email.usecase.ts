import { inject, injectable } from "tsyringe";
import { ISendOtpEmailUseCase } from "../../entities/useCaseInterfaces/auth/sent-otp-usecase.interface.js";
import { IEmailService } from "../../entities/useCaseInterfaces/services/email-service.interface.js";
import { IOtpService } from "../../entities/useCaseInterfaces/services/otp-service.interface.js";
import { IUserExistenceService } from "../../entities/useCaseInterfaces/services/user-existence-service.interface.js";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import chalk from "chalk";

@injectable()
export class SendOtpEmailUseCase implements ISendOtpEmailUseCase {
	constructor(
		@inject("IEmailService") private _emailService: IEmailService,
		@inject("IOtpService") private _otpService: IOtpService,
		@inject("IUserExistenceService")
		private _userExistenceService: IUserExistenceService,
		@inject("IOtpBcrypt") private _otpBcrypt: IBcrypt
	) {}
	async execute(email: string): Promise<void> {
		const emailExists = await this._userExistenceService.emailExists(email);
		if (emailExists) {
			throw new CustomError(
				ERROR_MESSAGES.EMAIL_EXISTS,
				HTTP_STATUS.CONFLICT
			);
		}

		const otp = this._otpService.generateOtp();
		console.log(
			chalk.yellowBright.bold(`OTP:`),
			chalk.greenBright.bold(otp)
		);
		const hashedOtp = await this._otpBcrypt.hash(otp);
		await this._otpService.storeOtp(email, hashedOtp);
		await this._emailService.sendOtpEmail(
			email,
			"Trimly - Verify Your Email",
			otp
		);
	}
}
