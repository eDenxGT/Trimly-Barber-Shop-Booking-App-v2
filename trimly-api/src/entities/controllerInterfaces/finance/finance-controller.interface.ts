import { Request, Response } from "express";

export interface IFinanceController {
	getWalletPageData(req: Request, res: Response): Promise<void>;
	topUpWallet(req: Request, res: Response): Promise<void>;
	verifyTopUpPayment(req: Request, res: Response): Promise<void>;
	handleTopUpPaymentFailure(req: Request, res: Response): Promise<void>;
	withdrawFromWallet(req: Request, res: Response): Promise<void>;
	getAllUserWithdrawals(req: Request, res: Response): Promise<void>;
	approveWithdrawal(req: Request, res: Response): Promise<void>;
	rejectWithdrawal(req: Request, res: Response): Promise<void>;
}
