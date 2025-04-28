import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity.js";

export interface IGetAllCommunitiesForBarberUseCase {
  execute({
    search,
    userId,
    page,
    limit,
  }: {
    search: string;
    userId: string;
    page: number;
    limit: number;
  }): Promise<{
    communities: ICommunityChatRoomEntity[];
    totalPages: number;
    currentPage: number;
  }>;
}
