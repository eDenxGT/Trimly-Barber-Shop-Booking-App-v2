import { IMeetingRoomEntity } from "../../models/chat/meeting-room.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IMeetingRoomRepository
  extends IBaseRepository<IMeetingRoomEntity> {
  findLastPlannedMeeting(
    communityId: string
  ): Promise<IMeetingRoomEntity | null>;

  getAllMeetingsForListing({
    search,
    status,
    date,
    page,
    limit
  }: {
    search: string;
    status: string;
    date: string;
    page: number;
    limit: number;
  }): Promise<{ meetings: IMeetingRoomEntity[]; totalPages: number }>;
}
