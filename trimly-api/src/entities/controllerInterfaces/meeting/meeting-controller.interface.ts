import { Request, Response } from "express";

export interface IMeetingController {
	scheduleMeet(req: Request, res: Response): Promise<void>;
	getMeetingByCommunityId(req: Request, res: Response): Promise<void>;
}
