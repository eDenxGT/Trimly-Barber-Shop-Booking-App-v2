import { inject, injectable } from "tsyringe";
import { IGoogleCalendarService } from "../../../entities/serviceInterfaces/google-calendar-service.interface.js";
import { IMeetingRoomRepository } from "../../../entities/repositoryInterfaces/chat/meeting-room-repository.interface.js";
import { generateUniqueId } from "../../../shared/utils/unique-uuid.helper.js";
import { CustomError } from "../../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";

@injectable()
export class ScheduleMeetingUseCase {
  constructor(
    @inject("IMeetingRoomRepository")
    private _meetingRoomRepository: IMeetingRoomRepository
  ) {}

  async execute(input: {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    communityId: string;
    userId: string;
    meetLink: string;
  }): Promise<void> {
    // ? Previous implementation
    // const meetLink = await this._calendarService.createMeeting({
    //   summary: input.title,
    //   description: input.description,
    //   start: input.startTime,
    //   end: input.endTime,
    // });

    const startTime = new Date(input.startTime);
    const endTime = new Date(input.endTime);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_DATES_FOR_MEETING,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const now = new Date();

    if (startTime <= now) {
      throw new CustomError(
        ERROR_MESSAGES.MEETING_CANNOT_SCHEDULE_IN_PAST,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (startTime >= endTime) {
      throw new CustomError(
        ERROR_MESSAGES.START_TIME_MUST_BE_BEFORE_END_TIME,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const isMeetingExistsForThisCommunity =
      await this._meetingRoomRepository.findOne({
        communityId: input.communityId,
        status: "scheduled",
      });

    if (isMeetingExistsForThisCommunity) {
      throw new CustomError(
        ERROR_MESSAGES.MEETING_ALREADY_EXISTS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this._meetingRoomRepository.save({
      meetingId: generateUniqueId("meeting-room"),
      title: input.title,
      description: input.description,
      communityId: input.communityId,
      scheduledBy: input.userId,
      startTime: input.startTime,
      endTime: input.endTime,
      meetLink: input.meetLink,
    });
  }
}
