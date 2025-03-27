import { Request, Response } from "express";

export interface IAuthController {
	// authenticateWithGoogle(req: Request, res: Response): Promise<void>;
	// forgotPassword(req: Request, res: Response): Promise<void>;
	// login(req: Request, res: Response): Promise<void>;
	// logout(req: Request, res: Response): Promise<void>;
	// handleTokenRefresh(req: Request, res: Response): void;
	register(req: Request, res: Response): Promise<void>;
	// resetPassword(req: Request, res: Response): Promise<void>;
	// sendOtpEmail(req: Request, res: Response): Promise<void>;
	// verifyOtp(req: Request, res: Response): Promise<void>;
}
