import { Request, Response } from "express";

export interface IShopController {
	getAllShops(req: Request, res: Response): Promise<void>;
	getAllNearestShopsForClient(req: Request, res: Response): Promise<void>;
	updateShopStatus(req: Request, res: Response): Promise<void>;
	getShopDetailsById(req: Request, res: Response): Promise<void>;
}
