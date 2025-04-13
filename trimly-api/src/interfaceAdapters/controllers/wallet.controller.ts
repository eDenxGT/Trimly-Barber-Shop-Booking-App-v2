import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IWalletController } from "../../entities/controllerInterfaces/finance/wallet-controller.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  TRole,
} from "../../shared/constants.js";
import { IGetWalletOverviewUseCase } from "../../entities/useCaseInterfaces/finance/wallet/get-wallet-overview-usecase.interface.js";
import { ITopUpWalletUseCase } from "../../entities/useCaseInterfaces/finance/wallet/topup-wallet-usecase.interface.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
import { IVerifyTopUpPaymentUseCase } from "../../entities/useCaseInterfaces/finance/wallet/verify-topup-payment-usecase.interface.js";
import { IUpdateWalletBalanceUseCase } from "../../entities/useCaseInterfaces/finance/wallet/update-wallet-balance-usecase.interface.js";

@injectable()
export class WalletController implements IWalletController {
  constructor(
    @inject("IGetWalletOverviewUseCase")
    private _getWalletOverviewUseCase: IGetWalletOverviewUseCase,
    @inject("ITopUpWalletUseCase")
    private _topUpWalletUseCase: ITopUpWalletUseCase,
    @inject("IVerifyTopUpPaymentUseCase")
    private _verifyTopUpPaymentUseCase: IVerifyTopUpPaymentUseCase,
    @inject("IUpdateWalletBalanceUseCase")
    private _updateWalletBalanceUseCase: IUpdateWalletBalanceUseCase
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

  async topUpWallet(req: Request, res: Response): Promise<void> {
    try {
      const { userId, role } = (req as CustomRequest).user;
      const { amount } = req.body;
      const numericAmount = Number(amount);

      if (!userId || !numericAmount || isNaN(numericAmount)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }

      const transactionId = generateUniqueId("transaction");

      const topUpInfo = await this._topUpWalletUseCase.execute(
        userId,
        role as "client" | "barber",
        transactionId,
        amount
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        orderId: topUpInfo.orderId,
        amount: topUpInfo.amount,
        currency: topUpInfo.currency,
        transactionId: transactionId,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  async verifyTopUpPayment(req: Request, res: Response): Promise<void> {
    try {
      const {
        transactionId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      const { userId, role } = (req as CustomRequest).user;

      if (!transactionId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }

      await this._verifyTopUpPaymentUseCase.execute(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        transactionId
      );

      await this._updateWalletBalanceUseCase.execute(
        userId,
        role as "client" | "barber",
        transactionId
      );

      res.status(HTTP_STATUS.ACCEPTED).json({
        success: true,
        message: SUCCESS_MESSAGES.PAYMENT_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  async handleTopUpPaymentFailure(req: Request, res: Response): Promise<void> {}
}
