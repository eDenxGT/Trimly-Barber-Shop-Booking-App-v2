import { Request, Response } from "express";

export interface IReviewController {
    addReview(req: Request, res: Response): Promise<void>;
}