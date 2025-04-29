import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IScheduleMeetingUseCase } from "../../entities/useCaseInterfaces/chat/meeting/schedule-meeting-usecase.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { IMeetingController } from "../../entities/controllerInterfaces/meeting/meeting-controller.interface.js";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";

@injectable()
export class MeetingController implements IMeetingController {
  constructor(
    @inject("IScheduleMeetingUseCase")
    private _scheduleMeetingUseCase: IScheduleMeetingUseCase
  ) {}

  //* ─────────────────────────────────────────────────────────────
  //*                    🛠️  Schedule Meeting
  //* ─────────────────────────────────────────────────────────────
  async scheduleMeet(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, startTime, endTime, communityId, meetLink } = req.body;
      const { userId } = (req as CustomRequest).user;

      await this._scheduleMeetingUseCase.execute({
        title,
        description,
        startTime,
        endTime,
        communityId,
        userId,
        meetLink,
      });

      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.MEETING_CREATED,
        success: true,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
