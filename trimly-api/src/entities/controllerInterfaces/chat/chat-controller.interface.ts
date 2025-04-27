import { Request, Response } from "express";

export interface IChatController {
  getChatById: (req: Request, res: Response) => Promise<void>;
  getAllChatsByUserId: (req: Request, res: Response) => Promise<void>;
  createCommunity: (req: Request, res: Response) => Promise<void>;
  getAllCommunitiesForAdmin: (req: Request, res: Response) => Promise<void>;
}
