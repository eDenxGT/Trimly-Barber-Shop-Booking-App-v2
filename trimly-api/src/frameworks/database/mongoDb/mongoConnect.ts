import mongoose from "mongoose";
import { config } from "../../../shared/config.js";
import chalk from "chalk";

export class MongoConnect {
	private _dbUrl: string;
	constructor() {
		this._dbUrl = config.database.URI;
	}
	async connectDB() {
		try {
			await mongoose.connect(this._dbUrl);
			console.log(
				chalk.yellowBright.bold(
					"\t|              " +
						chalk.greenBright.bold("Connected to MongoDB😊") +
						"                 |"
				)
			);
			console.log(
				chalk.yellowBright.bold(
					`\t|                                                     |`
				)
			);
			console.log(
				chalk.yellowBright.bold(
					`\t-------------------------------------------------------`
				)
			);
			// console.log(
			// 	"\t|         " +
			// 		"📦 Database connected successfully" +
			// 		"          |"
			// );
			// console.log(
			// 	`\t|                                                     |`
			// );
			// console.log(
			// 	`\t-------------------------------------------------------`
			// );
			// console.log("Database connected successfully. 📦");

			mongoose.connection.on("error", (error) => {
				const errorMessage = chalk.redBright.bold(
					"MongoDB connection error: " + error
				);
				console.log(errorMessage);
			});

			mongoose.connection.on("disconnected", () => {
				console.log("MongoDB disconnected");
			});
		} catch (error) {
			console.error("Failed to connect to MongoDB:", error);
			throw new Error("Database connection failed");
		}
	}
	public async disconnectDB(): Promise<void> {
		try {
			await mongoose.connection.close();
			console.log("✅ MongoDB Disconnected");
		} catch (err) {
			console.error("❌ Error Disconnecting MongoDB:", err);
		}
	}
}
