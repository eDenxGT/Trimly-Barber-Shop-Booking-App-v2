import { createClient } from "redis";
import { config } from "../../shared/config.js";
import chalk from "chalk";

export const redisClient = createClient({
	username: config.redis.REDIS_USERNAME,
	password: config.redis.REDIS_PASS,
	socket: {
		host: config.redis.REDIS_HOST,
		port: parseInt(config.redis.REDIS_PORT),
	},
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
	await redisClient.connect();
	console.log(
		chalk.yellowBright.bold(
			"\t|         " +
				chalk.blueBright.bold("📦 Redis connected successfully!") +
				"            |"
		)
	);
	//    console.log("Redis connected successfully!📦")
})();
