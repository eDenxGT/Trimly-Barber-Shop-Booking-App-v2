//* ====== Module Imports ====== *//
import { Request, RequestHandler, Response } from "express";

//* ====== Middleware Imports ====== *//;
import {
	authorizeRole,
	decodeToken,
	verifyAuth,
} from "../../interfaceAdapters/middlewares/auth.middleware.js";

//* ====== BaseRoute Import ====== *//
import { BaseRoute } from "./base.route.js";

//* ====== Controller Imports ====== *//
import {
	authController,
	blockStatusMiddleware,
	serviceController,
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

		this.router
			.route("/barber/services")
			.get(
				verifyAuth,
				authorizeRole(["barber"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					console.log("getting services", req.body);
					serviceController.getAllServicesByBarberId(req, res);
				}
			)
			.post(
				verifyAuth,
				authorizeRole(["barber"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					serviceController.addService(req, res);
				}
			);

		this.router
			.route("/barber/services/:serviceId")
			.put(
				verifyAuth,
				authorizeRole(["barber"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					serviceController.updateServiceById(req, res);
				}
			)
			.delete(
				verifyAuth,
				authorizeRole(["barber"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					serviceController.deleteServiceById(req, res);
				}
			);

		this.router.put(
			"/barber/update-password",
			verifyAuth,
			authorizeRole(["barber"]),
			blockStatusMiddleware.checkStatus as RequestHandler,
			(req: Request, res: Response) => {
				userController.changeUserPassword(req, res);
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

		this.router.post(
			"/barber/refresh-token",
			decodeToken,
			(req: Request, res: Response) => {
				console.log("refreshing barber", req.body);
				authController.handleTokenRefresh(req, res);
			}
		);
	}
}
