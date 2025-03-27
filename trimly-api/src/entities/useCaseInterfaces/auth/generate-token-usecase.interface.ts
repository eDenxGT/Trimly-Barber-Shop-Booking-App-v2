export interface IGenerateTokenUseCase {
	execute(
		id: string,
		userId: string,
		email: string,
		role: string
	): Promise<{ accessToken: string; refreshToken: string }>;
}
