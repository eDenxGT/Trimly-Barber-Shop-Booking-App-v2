//* ====== BaseRoute Import ====== *//
import { BaseRoute } from "../base.route.js";

//* ====== PrivateRoute Imports ====== *//
// import { AdminRoutes } from "../admin/admin.route";
// import { BarberRoutes } from "../barber/barber.route";
// import { ClientRoutes } from "../client/client.route";

export class PrivateRoutes extends BaseRoute {
	constructor() {
		super();
	}
	protected initializeRoutes(): void {
		// this.router.use("/_cl", new ClientRoutes().router);
		// this.router.use("/_ba", new BarberRoutes().router)
		// this.router.use("/_ad", new AdminRoutes().router)
	}
}
