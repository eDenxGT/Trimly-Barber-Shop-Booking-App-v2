import { inject, injectable } from "tsyringe";
import { IMeetingRoomRepository } from "../../../entities/repositoryInterfaces/chat/meeting-room-repository.interface.js";
import { CustomError } from "../../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";
import { ICancelMeetingUseCase } from "../../../entities/useCaseInterfaces/chat/meeting/cancel-meeting-usecase.interface.js";

@injectable()
export class CancelMeetingUseCase implements ICancelMeetingUseCase {
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

    if (meeting.status === "completed") {
      throw new CustomError(
        ERROR_MESSAGES.MEETING_ALREADY_COMPLETED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this._meetingRepository.update(
      { meetingId },
      { status: "cancelled" }
    );
  }
}
