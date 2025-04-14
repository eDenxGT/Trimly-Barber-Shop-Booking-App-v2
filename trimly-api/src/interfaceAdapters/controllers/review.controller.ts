import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IReviewController } from "../../entities/controllerInterfaces/review/review-controller.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import { IAddShopReviewUseCase } from "../../entities/useCaseInterfaces/review/add-shop-review-usecase.interface.js";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants.js";

@injectable()
export class ReviewController implements IReviewController {
  constructor(
    @inject("IAddShopReviewUseCase")
    private _addShopReviewUseCase: IAddShopReviewUseCase
  ) {}

  //* ─────────────────────────────────────────────────────────────
  //*                     🛠️  Add Review
  //* ─────────────────────────────────────────────────────────────
  async addReview(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as CustomRequest).user;
      const { shopId, rating, reviewText } = req.body;

      await this._addShopReviewUseCase.execute(
        shopId,
        userId,
        rating,
        reviewText
      );

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.REVIEW_ADDED,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
