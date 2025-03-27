//* ====== Node module-alias Imports( to import using @/ ) ====== *//
// import "module-alias/register.js";

//* ====== DI Imports ====== *//
import "reflect-metadata";
import "./frameworks/di/resolver.js";

//* ====== Module Imports ====== *//
import chalk from "chalk";

//* ====== Other Imports ====== *//
import { config } from "./shared/config.js";
import { MongoConnect } from "./frameworks/database/mongoDb/mongoConnect.js";
import { Server } from "./frameworks/http/server.js";

//* ====== Instance Creation ====== *//
const server = new Server();
const mongoConnect = new MongoConnect();

//* ====== Database Connection ====== *//
mongoConnect.connectDB();

//* ====== Server Startup ====== *//
server.getApp().listen(config.server.PORT, () => {
	console.log(
		chalk.yellowBright.bold(
			`\n\t-------------------------------------------------------`
		)
	);
	console.log(
		chalk.yellowBright.bold(
			`\t|                                                     |`
		)
	);
	console.log(
		chalk.yellowBright.bold(
			`\t|        🌐 Server is running on Port =>` +
				chalk.cyanBright.bold(` ${config.server.PORT}`) +
				`         |`
		)
	);
	// console.log(`\n\t-------------------------------------------------------`);
	// console.log(`\t|                                                     |`);
	// console.log(
	// 	`\t|        🌐 Server is running on Port =>` +
	// 		` ${config.server.PORT}` +
	// 		`         |`
	// );
	// console.log(`Server is running on port ${config.server.PORT} ⚡`);
});
