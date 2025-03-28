import { injectable } from "tsyringe";
import { redisClient } from "../../../frameworks/cache/redis.client.js";
import { IRedisTokenRepository } from "../../../entities/repositoryInterfaces/redis/redis-token-repository.interface.js";

@injectable()
export class RedisTokenRepository implements IRedisTokenRepository {
	async blackListToken(token: string, expiresIn: number): Promise<void> {
		await redisClient.set(token, "blacklisted", { EX: expiresIn });
	}

	async isTokenBlackListed(token: string): Promise<boolean> {
		const result = await redisClient.get(token);
		return result === "blacklisted";
	}

	// Reset token
	async storeResetToken(userId: string, token: string): Promise<void> {
		const key = `reset_token:${userId}`;
		await redisClient.setEx(key, 300, token);
	}

	async verifyResetToken(userId: string, token: string): Promise<boolean> {
		const key = `reset_token:${userId}`;
		const storedToken = await redisClient.get(key);
		return storedToken === token;
	}

	async deleteResetToken(userId: string) {
		const key = `reset_token:${userId}`;
		await redisClient.del(key);
	}
}
