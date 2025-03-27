export interface IResetPasswordUseCase {
	execute({
		password,
		role,
		token,
	}: {
		password: string;
		role: string;
		token: string;
	}): Promise<void>;
}
