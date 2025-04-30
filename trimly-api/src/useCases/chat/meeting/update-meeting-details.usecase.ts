import { inject, injectable } from "tsyringe";
import { IUpdateMeetingDetailsUseCase } from "../../../entities/useCaseInterfaces/chat/meeting/update-meeting-details-usecase.interface.js";
import { IMeetingRoomRepository } from "../../../entities/repositoryInterfaces/chat/meeting-room-repository.interface.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";
import { CustomError } from "../../../entities/utils/custom.error.js";

@injectable()
export class UpdateMeetingDetailsUseCase
  implements IUpdateMeetingDetailsUseCase
{
  constructor(
    @inject("IMeetingRoomRepository")
    private _meetingRoomRepository: IMeetingRoomRepository
  ) {}

  async execute({
    title,
    description,
    startTime,
    endTime,
    communityId,
    meetLink,
    meetingId,
  }: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    communityId: string;
    meetLink: string;
    meetingId: string;
  }): Promise<void> {
    const startMeetTime = new Date(startTime);
    const endMeetTime = new Date(endTime);

    if (isNaN(startMeetTime.getTime()) || isNaN(endMeetTime.getTime())) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_DATES_FOR_MEETING,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const now = new Date();

    if (startMeetTime <= now) {
      throw new CustomError(
        ERROR_MESSAGES.MEETING_CANNOT_SCHEDULE_IN_PAST,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (startMeetTime >= endMeetTime) {
      throw new CustomError(
        ERROR_MESSAGES.START_TIME_MUST_BE_BEFORE_END_TIME,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    await this._meetingRoomRepository.update(
      { meetingId, communityId },
      {
        title,
        description,
        startTime,
        endTime,
        meetLink,
      }
    );
  }
}
