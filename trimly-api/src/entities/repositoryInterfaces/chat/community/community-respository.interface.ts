import { IBaseRepository } from "../../base-repository.interface.js";
import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity.js";

export interface ICommunityRepository
  extends IBaseRepository<ICommunityChatRoomEntity> {
  findAllCommunitiesForAdminSide(
    page: number,
    limit: number
  ): Promise<{
    communities: ICommunityChatRoomEntity[];
    totalPages: number;
    currentPage: number;
  }>;
}
