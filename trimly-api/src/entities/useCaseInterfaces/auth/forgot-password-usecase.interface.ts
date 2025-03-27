export interface IForgotPasswordUseCase {
	execute({ email, role }: { email: string; role: string }): Promise<void>;
}
