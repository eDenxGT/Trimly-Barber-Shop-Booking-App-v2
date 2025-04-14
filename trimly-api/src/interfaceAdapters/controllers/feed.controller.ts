import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IFeedController } from "../../entities/controllerInterfaces/feed/feed-controller.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { IAddPostUseCase } from "../../entities/useCaseInterfaces/feed/add-post-usecase.interface.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../shared/constants.js";

@injectable()
export class FeedController implements IFeedController {
  constructor(
    @inject("IAddPostUseCase") private _addPostUseCase: IAddPostUseCase
  ) {}

  //* ─────────────────────────────────────────────────────────────
  //*                     🛠️ Add Post
  //* ─────────────────────────────────────────────────────────────
  async addPost(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as CustomRequest).user;
      const { caption, description, image } = req.body;
      if (!userId || !caption || !description || !image) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }
      await this._addPostUseCase.execute(userId, caption, description, image);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.POST_ADDED,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
