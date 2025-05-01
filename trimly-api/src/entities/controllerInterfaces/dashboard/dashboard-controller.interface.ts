import { Request, Response } from "express";

export interface IDashboardController {
  getClientHomePageData(req: Request, res: Response): Promise<void>;
  getBarberDashboardData(req: Request, res: Response): Promise<void>;
  getAdminDashboardData(req: Request, res: Response): Promise<void>;
}
