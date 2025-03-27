//* ====== Module Imports ====== *//
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

//* ====== Config Import ====== *//
import { config } from "../../shared/config.js";

//* ====== Middleware Imports ====== *//
import { notFound } from "../../interfaceAdapters/middlewares/not-found.middleware.js";
import { errorHandler } from "../../interfaceAdapters/middlewares/error.middleware.js";

//* ====== Route Imports ====== *//
import { AuthRoutes } from "../routes/auth.route.js";
import { PrivateRoutes } from "../routes/private/private.route.js";
import morganLogger from "../../interfaceAdapters/middlewares/logger.js";

//* ====== Express App ====== *//
export class Server {
	private _app: Application;

	constructor() {
		this._app = express();

		this.configureMiddlewares();
		this.configureRoutes();
		this.configureErrorHandling();
	}

	//* ====== Middlewares Configurations ====== *//
	private configureMiddlewares(): void {
		// this._app.use(morgan(config.loggerStatus));
		this._app.use(morganLogger);

		this._app.use(helmet());

		this._app.use(
			cors({
				origin: config.cors.ALLOWED_ORIGIN,
				methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
				allowedHeaders: ["Authorization", "Content-Type"],
				credentials: true,
			})
		);
		// this._app.use(express.json());

		this._app.use((req: Request, res: Response, next: NextFunction) => {
			express.json()(req, res, next);
		});

		this._app.use(cookieParser());

		this._app.use(
			rateLimit({
				windowMs: 15 * 60 * 1000,
				max: 1000,
			})
		);
	}

	//* ====== Routes Configurations ====== *//
	private configureRoutes(): void {
		this._app.use("/api/v1/auth", new AuthRoutes().router);
		this._app.use("/api/v1/pvt", new PrivateRoutes().router);

		this._app.use("*", notFound);
	}

	//* ====== Error Configurations ====== *//
	private configureErrorHandling(): void {
		this._app.use(errorHandler);
	}

	//* ====== Get App ====== *//
	public getApp(): Application {
		return this._app;
	}
}
