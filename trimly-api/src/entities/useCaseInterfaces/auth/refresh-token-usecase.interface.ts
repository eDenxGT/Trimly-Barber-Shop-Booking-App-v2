export interface IRefreshTokenUseCase {
	execute(refreshToken: string): {
		role: string;
		accessToken: string;
	};
}
