import { Request, Response } from "express";

export interface IUserController {
	// getAllUsers(req: Request, res: Response): Promise<void>;
	// updateUserStatus(req: Request, res: Response): Promise<void>;
	changeUserPassword(req: Request, res: Response): Promise<void>;
	updateUserDetails(req: Request, res: Response): Promise<void>;
}
