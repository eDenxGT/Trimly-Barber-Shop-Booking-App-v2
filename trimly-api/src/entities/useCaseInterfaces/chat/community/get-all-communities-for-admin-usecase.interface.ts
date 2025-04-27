import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity.js";

export interface IGetAllCommunitiesForAdminUseCase {
  execute({ page, limit }: { page: number; limit: number }): Promise<{
    communities: ICommunityChatRoomEntity[];
    totalPages: number;
    currentPage: number
  }>;
}
