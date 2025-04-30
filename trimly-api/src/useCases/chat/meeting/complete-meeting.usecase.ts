import { inject, injectable } from "tsyringe";
import { IMeetingRoomRepository } from "../../../entities/repositoryInterfaces/chat/meeting-room-repository.interface.js";
import { CustomError } from "../../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";
import { ICompleteMeetingUseCase } from "../../../entities/useCaseInterfaces/chat/meeting/complete-meeting-usecase.interface.js";

@injectable()
export class CompleteMeetingUseCase implements ICompleteMeetingUseCase {
  constructor(
    @inject("IMeetingRoomRepository")
    private _meetingRepository: IMeetingRoomRepository
  ) {}

  async execute({ meetingId }: { meetingId: string }): Promise<void> {
    const meeting = await this._meetingRepository.findOne({ meetingId });

    if (!meeting) {
      throw new CustomError(
        ERROR_MESSAGES.MEETING_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (meeting.status === "cancelled") {
      throw new CustomError(
        ERROR_MESSAGES.MEETING_ALREADY_CANCELLED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (new Date(meeting.endTime) > new Date()) {
      throw new CustomError(
        ERROR_MESSAGES.MEETING_CANNOT_COMPLETE_BEFORE_TIME_ENDS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this._meetingRepository.update(
      { meetingId },
      { status: "completed" }
    );
  }
}
