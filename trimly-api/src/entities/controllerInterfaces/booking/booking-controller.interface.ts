import { Request, Response } from "express";

export interface IBookingController {
	getAllBookings(req: Request, res: Response): Promise<void>;
	createBooking(req: Request, res: Response): Promise<void>;
	verifyPayment(req: Request, res: Response): Promise<void>;
	handlePaymentFailure(req: Request, res: Response): Promise<void>;
	updateBookingComplete(req: Request, res: Response): Promise<void>;
	cancelBooking(req: Request, res: Response): Promise<void>;
	handleBookWithWallet(req: Request, res: Response): Promise<void>;
}
