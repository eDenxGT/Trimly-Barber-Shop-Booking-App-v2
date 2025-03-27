import { createClient } from "redis";
import { config } from "../../shared/config.js";

const client = createClient({
	username: config.redis.REDIS_USERNAME,
	password: config.redis.REDIS_PASS,
	socket: {
		host: config.redis.REDIS_HOST,
		port: parseInt(config.redis.REDIS_PORT),
	},
});

client.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
	await client.connect();
	console.log(`\t|          📦 Redis connected successfully!           |`);
	//    console.log("Redis connected successfully!📦")
})();

export default client;
