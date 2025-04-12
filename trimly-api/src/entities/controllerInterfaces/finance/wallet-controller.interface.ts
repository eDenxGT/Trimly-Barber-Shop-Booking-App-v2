import { Request, Response } from "express";

export interface IWalletController {
  getWalletPageData(req: Request, res: Response): Promise<void>;
}
