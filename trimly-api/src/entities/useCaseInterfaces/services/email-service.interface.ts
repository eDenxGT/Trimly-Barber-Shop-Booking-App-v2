export interface IEmailService {
	sendCustomEmail(to: string, subject: string, content: string): Promise<void>;
	sendResetEmail(
		to: string,
		subject: string,
		resetLink: string
	): Promise<void>;
	sendOtpEmail(to: string, subject: string, otp: string): Promise<void>;
}
