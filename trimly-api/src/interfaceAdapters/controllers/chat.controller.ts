import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IChatController } from "../../entities/controllerInterfaces/chat/chat-controller.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { IGetChatByUserUseCase } from "../../entities/useCaseInterfaces/chat/get-chat-by-user-usecase.interface.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import { IGetAllChatsByUserUseCase } from "../../entities/useCaseInterfaces/chat/get-all-chats-by-user.usecase.interface.js";
import { IGetChatByChatIdUseCase } from "../../entities/useCaseInterfaces/chat/get-chat-by-chatid.usecase.js";

@injectable()
export class ChatController implements IChatController {
  constructor(
    @inject("IGetChatByUserUseCase")
    private _getChatByUserUseCase: IGetChatByUserUseCase,
    @inject("IGetAllChatsByUserUseCase")
    private _getAllChatsByUserUseCase: IGetAllChatsByUserUseCase,
    @inject("IGetChatByChatIdUseCase")
    private _getChatByChatIdUseCase: IGetChatByChatIdUseCase
  ) {}

  //* ─────────────────────────────────────────────────────────────
  //*                🛠️  Get Chat By Id
  //* ─────────────────────────────────────────────────────────────
  async getChatById(req: Request, res: Response) {
    try {
      const { role, userId: currentUserId } = (req as CustomRequest).user;
      const { userId: opponentUserId, chatId } = req.query;

      if (chatId) {
        const chat = await this._getChatByChatIdUseCase.execute(
          String(chatId),
          role as "client" | "barber"
        );
        res.status(HTTP_STATUS.OK).json({
          success: true,
          chat,
        });
        return;
      }

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

      res.status(HTTP_STATUS.OK).json({
        success: true,
        chat,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                🛠️  Get All Chats By User Id
  //* ─────────────────────────────────────────────────────────────
  async getAllChatsByUserId(req: Request, res: Response) {
    try {
      const { role, userId } = (req as CustomRequest).user;

      if (!userId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }

      const chats = await this._getAllChatsByUserUseCase.execute(
        userId,
        role as "client" | "barber"
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        chats,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
