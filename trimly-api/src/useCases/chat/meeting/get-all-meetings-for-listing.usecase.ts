import { inject, injectable } from "tsyringe";
import { IGetAllMeetingsForListingUseCase } from "../../../entities/useCaseInterfaces/chat/meeting/get-all-meetings-for-listing-usecase.interface.js";
import { IMeetingRoomEntity } from "../../../entities/models/chat/meeting-room.entity.js";
import { IMeetingRoomRepository } from "../../../entities/repositoryInterfaces/chat/meeting-room-repository.interface.js";

@injectable()
export class GetAllMeetingsForListingUseCase
  implements IGetAllMeetingsForListingUseCase
{
  constructor(
    @inject("IMeetingRoomRepository")
    private _meetingRoomRepository: IMeetingRoomRepository
  ) {}

  async execute({
    search,
    status,
    date,
    page,
    limit,
  }: {
    search: string;
    status: string;
    date: string;
    page: number;
    limit: number;
  }): Promise<{ meetings: IMeetingRoomEntity[]; totalPages: number }> {
    return await this._meetingRoomRepository.getAllMeetingsForListing({
      search,
      status,
      date,
      page,
      limit,
    });
  }
}
