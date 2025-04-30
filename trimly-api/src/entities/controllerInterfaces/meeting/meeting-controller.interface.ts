import { Request, Response } from "express";

export interface IMeetingController {
	scheduleMeet(req: Request, res: Response): Promise<void>;
	getMeetingByCommunityId(req: Request, res: Response): Promise<void>;
	getAllMeetingsForListing(req: Request, res: Response): Promise<void>;
	updateMeetingDetails(req: Request, res: Response): Promise<void>;
	cancelMeeting(req: Request, res: Response): Promise<void>;
	completeMeeting(req: Request, res: Response): Promise<void>;
}
