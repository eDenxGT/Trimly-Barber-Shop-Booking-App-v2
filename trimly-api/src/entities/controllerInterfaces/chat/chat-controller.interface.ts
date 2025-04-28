import { Request, Response } from "express";

export interface IChatController {
  getChatById: (req: Request, res: Response) => Promise<void>;
  getAllChatsByUserId: (req: Request, res: Response) => Promise<void>;
  createCommunity: (req: Request, res: Response) => Promise<void>;
  getAllCommunitiesForAdmin: (req: Request, res: Response) => Promise<void>;
  getAllCommunitiesForBarberListing: (
    req: Request,
    res: Response
  ) => Promise<void>;
  getCommunityForEdit: (req: Request, res: Response) => Promise<void>;
  editCommunity: (req: Request, res: Response) => Promise<void>;
  updateCommunityStatus: (req: Request, res: Response) => Promise<void>;
  deleteCommunity: (req: Request, res: Response) => Promise<void>;
  barberJoinCommunity: (req: Request, res: Response) => Promise<void>;
  getCommunityChatByChatIdForBarber: (req: Request, res: Response) => Promise<void>;
  getAllCommunityChatsByBarberId: (req: Request, res: Response) => Promise<void>;
}
