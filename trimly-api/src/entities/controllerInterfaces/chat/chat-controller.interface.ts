import { Request, Response } from "express";

export interface IChatController {
  getChatById: (req: Request, res: Response) => Promise<void>;
}
