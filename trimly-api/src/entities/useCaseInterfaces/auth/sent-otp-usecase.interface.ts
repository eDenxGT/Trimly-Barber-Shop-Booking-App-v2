export interface ISendOtpEmailUseCase {
	execute(email: string): Promise<void>;
}
