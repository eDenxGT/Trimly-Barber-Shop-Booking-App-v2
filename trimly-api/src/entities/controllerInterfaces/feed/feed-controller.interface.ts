import { Request, Response } from "express";

export interface IFeedController {
  addPost(req: Request, res: Response): Promise<void>;
}
