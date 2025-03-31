export interface IChangeUserPasswordUseCase {
	execute({
		oldPassword,
		newPassword,
		email,
		role,
	}: {
		oldPassword: string;
		newPassword: string;
		email: string;
		role: string;
	}): Promise<void>;
}
