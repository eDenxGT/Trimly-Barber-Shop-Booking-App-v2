//* ====== BaseRoute Import ====== *//
import { BaseRoute } from "../base.route.js";

//* ====== PrivateRoute Imports ====== *//
import { BarberRoutes } from "../barber.route.js";
import { ClientRoutes } from "../client.route.js";
import { AdminRoutes } from "../admin.route.js";

export class PrivateRoutes extends BaseRoute {
	constructor() {
		super();
	}
	protected initializeRoutes(): void {
		this.router.use("/_cl", new ClientRoutes().router);
		this.router.use("/_ba", new BarberRoutes().router)
		this.router.use("/_ad", new AdminRoutes().router)
	}
}
