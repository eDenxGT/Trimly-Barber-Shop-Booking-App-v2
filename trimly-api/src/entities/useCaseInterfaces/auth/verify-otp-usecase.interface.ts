export interface IVerifyOtpUseCase {
	execute({ email, otp }: { email: string; otp: string }): Promise<void>;
}
