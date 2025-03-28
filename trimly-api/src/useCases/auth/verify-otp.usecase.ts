import { inject, injectable } from "tsyringe";
import { IOtpService } from "../../entities/useCaseInterfaces/services/otp-service.interface.js";
import { IVerifyOtpUseCase } from "../../entities/useCaseInterfaces/auth/verify-otp-usecase.interface.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { CustomError } from "../../entities/utils/custom.error.js";

@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
	constructor(@inject("IOtpService") private _otpService: IOtpService) {}
	async execute({
		email,
		otp,
	}: {
		email: string;
		otp: string;
	}): Promise<void> {
		const isOtpValid = await this._otpService.verifyOtp(email, otp);
		if (!isOtpValid)
			throw new CustomError(
				ERROR_MESSAGES.INVALID_OTP,
				HTTP_STATUS.BAD_REQUEST
			);
	}
}
