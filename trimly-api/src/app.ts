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
import { ExpressServer } from "./frameworks/http/server.js";
import { createServer } from "http";
import { SocketServer } from "./frameworks/websockets/socket.server.js";
import socketLogger from "./shared/utils/socket.logger.js";

//* ====== Instance Creation ====== *//
const expressServer = new ExpressServer();
const mongoConnect = new MongoConnect();

//* ====== Database Connection ====== *//
mongoConnect.connectDB();

//* ====== Create HTTP Server from Express App ====== *//
const httpServer = createServer(expressServer.getApp());

//* ====== Setup Socket Server ====== *//
const socketServer = new SocketServer(httpServer);

//* ====== Socket Events Setup ====== *//
socketServer.onConnection((socket) => {
  console.log(chalk.green.bold("⚡ New Socket connected:", socket.id));
  socketLogger.info("New socket connected", {
    socketId: socket.id,
    event: "connect",
  });
  socket.on("disconnect", () => {
    console.log(chalk.red.bold("❌ Socket disconnected:", socket.id));
    socketLogger.info("Socket disconnected", {
      socketId: socket.id,
      event: "disconnect",
    });
  });
});

//* ====== Server Startup ====== *//
httpServer.listen(config.server.PORT, () => {
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
