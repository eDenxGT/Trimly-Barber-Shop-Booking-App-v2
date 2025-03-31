//* ====== Module Imports ====== *//
import { Request, RequestHandler, Response } from "express";

//* ====== Middleware Imports ====== *//

//* ====== BaseRoute Import ====== *//
import { BaseRoute } from "./base.route.js";
import {
	authorizeRole,
	verifyAuth,
} from "../../interfaceAdapters/middlewares/auth.middleware.js";
import { authController, blockStatusMiddleware, userController } from "../di/resolver.js";

export class ClientRoutes extends BaseRoute {
	constructor() {
		super();
	}
	protected initializeRoutes(): void {
		this.router
			.route("/client/details")
			.put(
				verifyAuth,
				authorizeRole(["client"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					userController.updateUserDetails(req, res);
				}
			);

		// logout
		this.router.post(
			"/client/logout",
			verifyAuth,
			authorizeRole(["client"]),
			blockStatusMiddleware.checkStatus as RequestHandler,
			(req: Request, res: Response) => {
				authController.logout(req, res);
			}
		);
	}
}
