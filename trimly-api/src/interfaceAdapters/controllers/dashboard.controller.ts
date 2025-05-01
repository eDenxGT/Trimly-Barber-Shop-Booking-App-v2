import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IDashboardController } from "../../entities/controllerInterfaces/dashboard/dashboard-controller.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import { IGetNearest3ShopsForClientUseCase } from "../../entities/useCaseInterfaces/shop/get-nearest-3-shops-for-client-usecase.interface.js";
import { IGetLastBookingByUserUseCase } from "../../entities/useCaseInterfaces/booking/get-last-booking-by-user-usecase.interface.js";

@injectable()
export class DashboardController implements IDashboardController {
  constructor(
    @inject("IGetNearest3ShopsForClientUseCase")
    private _getNearest3ShopsForClientUseCase: IGetNearest3ShopsForClientUseCase,
    @inject("IGetLastBookingByUserUseCase")
    private _getLastBookingByUserUseCase: IGetLastBookingByUserUseCase
  ) {}

  //* ─────────────────────────────────────────────────────────────
  //*                 🛠️ Get Client Home Page Data
  //* ─────────────────────────────────────────────────────────────
  async getClientHomePageData(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as CustomRequest).user;
      const { latitude, longitude } = req.query;

      if (!userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        });
        return;
      }

      const shops = await this._getNearest3ShopsForClientUseCase.execute({
        userId,
        latitude: Number(latitude),
        longitude: Number(longitude),
      });

      const lastBooking = await this._getLastBookingByUserUseCase.execute({
        userId,
      });
      console.log(lastBooking, shops);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        shops,
        lastBooking,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
