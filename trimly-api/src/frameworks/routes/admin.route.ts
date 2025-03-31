//* ====== Module Imports ====== *//
import { Request, RequestHandler, Response } from "express";

//* ====== Middleware Imports ====== *//

//* ====== BaseRoute Import ====== *//
import { BaseRoute } from "./base.route.js";
import {
	authorizeRole,
	verifyAuth,
} from "../../interfaceAdapters/middlewares/auth.middleware.js";
import {
	authController,
	blockStatusMiddleware,
	userController,
} from "../di/resolver.js";

//* ====== Controller Imports ====== *//

export class AdminRoutes extends BaseRoute {
	constructor() {
		super();
	}
	protected initializeRoutes(): void {
		this.router
			.route("/admin/details")
			.put(
				verifyAuth,
				authorizeRole(["admin"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					userController.updateUserDetails(req, res);
				}
			);

		// logout
		this.router.post(
			"/admin/logout",
			verifyAuth,
			authorizeRole(["admin"]),
			blockStatusMiddleware.checkStatus as RequestHandler,
			(req: Request, res: Response) => {
				authController.logout(req, res);
			}
		);
	}
}
