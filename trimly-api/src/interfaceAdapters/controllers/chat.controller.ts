import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IChatController } from "../../entities/controllerInterfaces/chat/chat-controller.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { IGetChatByUserUseCase } from "../../entities/useCaseInterfaces/chat/get-chat-by-user-usecase.interface.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";

@injectable()
export class ChatController implements IChatController {
  constructor(
    @inject("IGetChatByUserUseCase")
    private _getChatByUserUseCase: IGetChatByUserUseCase
  ) {}

  //* ─────────────────────────────────────────────────────────────
  //*                🛠️  Get Chat By User Id
  //* ─────────────────────────────────────────────────────────────
  async getChatById(req: Request, res: Response) {
    try {
      const { role, userId: currentUserId } = (req as CustomRequest).user;
      const { userId: opponentUserId } = req.query;
console.log(req.query)
      if (!opponentUserId || !currentUserId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }

      const chat = await this._getChatByUserUseCase.execute(
        String(opponentUserId),
        currentUserId,
        role
      );
      console.log("FEFSFSFESFSF",chat);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        chat,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
