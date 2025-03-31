//* ====== Module Imports ====== *//
import { Request, RequestHandler, Response } from "express";

//* ====== Middleware Imports ====== *//;
import {
	authorizeRole,
	verifyAuth,
} from "../../interfaceAdapters/middlewares/auth.middleware.js";

//* ====== BaseRoute Import ====== *//
import { BaseRoute } from "./base.route.js";

//* ====== Controller Imports ====== *//
import {
	authController,
	blockStatusMiddleware,
	userController,
} from "../di/resolver.js";

export class BarberRoutes extends BaseRoute {
	constructor() {
		super();
	}
	protected initializeRoutes(): void {
		this.router
			.route("/barber/details")
			.put(
				verifyAuth,
				authorizeRole(["barber"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					userController.updateUserDetails(req, res);
				}
			);

		// logout
		this.router.post(
			"/barber/logout",
			verifyAuth,
			authorizeRole(["barber"]),
			blockStatusMiddleware.checkStatus as RequestHandler,
			(req: Request, res: Response) => {
				authController.logout(req, res);
			}
		);
	}
}
