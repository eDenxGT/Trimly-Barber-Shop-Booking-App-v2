import { Request, Response } from "express";

export interface IServiceController {
	addService(req: Request, res: Response): Promise<void>;
	getAllServicesByBarberId(req: Request, res: Response): Promise<void>;
	updateServiceById(req: Request, res: Response): Promise<void>;
	deleteServiceById(req: Request, res: Response): Promise<void>;
}
