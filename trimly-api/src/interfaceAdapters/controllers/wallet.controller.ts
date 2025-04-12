import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IWalletController } from "../../entities/controllerInterfaces/finance/wallet-controller.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import { ERROR_MESSAGES, HTTP_STATUS, TRole } from "../../shared/constants.js";
import { IGetWalletOverviewUseCase } from "../../entities/useCaseInterfaces/finance/wallet/get-wallet-overview-usecase.interface.js";

@injectable()
export class WalletController implements IWalletController {
  constructor(
    @inject("IGetWalletOverviewUseCase")
    private _getWalletOverviewUseCase: IGetWalletOverviewUseCase
  ) {}

  async getWalletPageData(req: Request, res: Response): Promise<void> {
    try {
      const { userId, role } = (req as CustomRequest).user;
      if (!userId || !role) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }

      const walletOverview = await this._getWalletOverviewUseCase.execute(
        userId,
        role as TRole
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        balance: walletOverview?.balance || 0,
        transactions: walletOverview?.transactions || [],
        withdrawals: walletOverview?.withdrawals || [],
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
