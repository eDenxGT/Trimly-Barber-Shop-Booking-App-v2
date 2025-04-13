import { Request, Response } from "express";

export interface IWalletController {
  getWalletPageData(req: Request, res: Response): Promise<void>;
  topUpWallet(req: Request, res: Response): Promise<void>;
  verifyTopUpPayment(req: Request, res: Response): Promise<void>;
  handleTopUpPaymentFailure(req: Request, res: Response): Promise<void>;
}
