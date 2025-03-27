export interface IRevokeRefreshTokenUseCase {
	execute(token: string): Promise<void>;
}
