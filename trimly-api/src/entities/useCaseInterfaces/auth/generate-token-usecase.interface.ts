export interface IGenerateTokenUseCase {
	execute(
		userId: string,
		email: string,
		role: string
	): Promise<{ accessToken: string; refreshToken: string }>;
}
