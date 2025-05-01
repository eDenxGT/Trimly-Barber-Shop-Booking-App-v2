import { Request, Response } from "express";

export interface IDashboardController {
  getClientHomePageData(req: Request, res: Response): Promise<void>;
}
