import { inject, injectable } from "tsyringe";
import { INotificationController } from "../../entities/controllerInterfaces/notifications/notification-controller.interface.js";
import { Request, Response } from "express";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import { IGetNotificationsByUserUseCase } from "../../entities/useCaseInterfaces/notifications/get-notifications-by-user-usecase.interface.js";
import { HTTP_STATUS } from "../../shared/constants.js";
import { IMarkAllNotificationsAsReadByUserUseCase } from "../../entities/useCaseInterfaces/notifications/mark-all-notifications-as-read-by-user-usecase.interface.js";
import { IMarkSingleNotificationAsReadByUserUseCase } from "../../entities/useCaseInterfaces/notifications/mark-single-notification-as-read-by-user-usecase.interface.js";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject("IGetNotificationsByUserUseCase")
    private _getNotificationsByUserUseCase: IGetNotificationsByUserUseCase,
    @inject("IMarkAllNotificationsAsReadByUserUseCase")
    private _markAllNotificationsAsReadByUserUseCase: IMarkAllNotificationsAsReadByUserUseCase,
    @inject("IMarkSingleNotificationAsReadByUserUseCase")
    private _markSingleNotificationAsReadByUserUseCase: IMarkSingleNotificationAsReadByUserUseCase
  ) {}
  async getNotificationsByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as CustomRequest).user;
      const notifications = await this._getNotificationsByUserUseCase.execute({
        userId,
      });

      res.status(HTTP_STATUS.OK).json({ success: true, notifications });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  async markAllNotificationsAsReadByUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { userId } = (req as CustomRequest).user;
      await this._markAllNotificationsAsReadByUserUseCase.execute({
        userId,
      });
      res.status(HTTP_STATUS.OK).json({ success: true });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  async markSingleNotificationAsReadByUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { userId } = (req as CustomRequest).user;
      const { notificationId } = req.params;
      await this._markSingleNotificationAsReadByUserUseCase.execute({
        userId,
        notificationId,
      });
      res.status(HTTP_STATUS.OK).json({ success: true });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
