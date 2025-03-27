//* ====== Module Imports ====== *//
import { Request, RequestHandler, Response } from "express";

//* ====== Middleware Imports ====== *//;

//* ====== BaseRoute Import ====== *//
import { BaseRoute } from "./base.route.js";

//* ====== Controller Imports ====== *//

export class BarberRoutes extends BaseRoute {
	constructor() {
		super();
	}
	protected initializeRoutes(): void {}
}
