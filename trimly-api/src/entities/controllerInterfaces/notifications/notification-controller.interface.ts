import { Request, Response } from "express";

export interface INotificationController {
  getNotificationsByUser(req: Request, res: Response): Promise<void>;
  markAllNotificationsAsReadByUser(req: Request, res: Response): Promise<void>;
  markSingleNotificationAsReadByUser(
    req: Request,
    res: Response
  ): Promise<void>;
}
