import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IScheduleMeetingUseCase } from "../../entities/useCaseInterfaces/chat/meeting/schedule-meeting-usecase.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { IMeetingController } from "../../entities/controllerInterfaces/meeting/meeting-controller.interface.js";
import {
	ERROR_MESSAGES,
	HTTP_STATUS,
	SUCCESS_MESSAGES,
} from "../../shared/constants.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import { IGetMeetingByCommunityIdUseCase } from "../../entities/useCaseInterfaces/chat/meeting/get-meeting-by-communityid-usecase.interface.js";
import { CustomError } from "../../entities/utils/custom.error.js";

@injectable()
export class MeetingController implements IMeetingController {
	constructor(
		@inject("IScheduleMeetingUseCase")
		private _scheduleMeetingUseCase: IScheduleMeetingUseCase,
		@inject("IGetMeetingByCommunityIdUseCase")
		private _getMeetingByCommunityIdUseCase: IGetMeetingByCommunityIdUseCase
	) {}

	//* ─────────────────────────────────────────────────────────────
	//*                    🛠️  Schedule Meeting
	//* ─────────────────────────────────────────────────────────────
	async scheduleMeet(req: Request, res: Response): Promise<void> {
		try {
			const {
				title,
				description,
				startTime,
				endTime,
				communityId,
				meetLink,
			} = req.body;
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

	//* ─────────────────────────────────────────────────────────────
	//*                🛠️  Get Meeting By Community Id
	//* ─────────────────────────────────────────────────────────────
	async getMeetingByCommunityId(req: Request, res: Response): Promise<void> {
		try {
			const { communityId } = req.query;

			if (!communityId) {
				throw new CustomError(
					ERROR_MESSAGES.MISSING_PARAMETERS,
					HTTP_STATUS.BAD_REQUEST
				);
			}

			const meetingRoom =
				await this._getMeetingByCommunityIdUseCase.execute(
					String(communityId)
				);

			res.status(HTTP_STATUS.OK).json({
				success: true,
				meeting: meetingRoom,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}
}
