export interface IRedisTokenRepository {
	blackListToken(token: string, expiresIn: number): Promise<void>;
	isTokenBlackListed(token: string): Promise<boolean>;
	storeResetToken(userId: string, token: string): Promise<void>;
	verifyResetToken(userId: string, token: string): Promise<boolean>;
	deleteResetToken(userId: string): Promise<void>;
}
