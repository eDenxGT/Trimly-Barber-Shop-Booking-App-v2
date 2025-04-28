import { IBaseRepository } from "../../base-repository.interface.js";
import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity.js";

export interface ICommunityRepository
  extends IBaseRepository<ICommunityChatRoomEntity> {
  findAllCommunitiesForListing({
    filter,
    search,
    userId,
    page,
    limit,
  }: {
    filter: Partial<ICommunityChatRoomEntity>;
    search: string;
    userId?: string;
    page: number;
    limit: number;
  }): Promise<{
    communities: ICommunityChatRoomEntity[];
    totalPages: number;
    currentPage: number;
  }>;

  getAllCommunityChatsByUser({
    userId,
  }: {
    userId: string;
  }): Promise<Partial<ICommunityChatRoomEntity>[]>;

  getCommunityChat({
    userId,
    chatId,
  }: {
    userId: string;
    chatId: string;
  }): Promise<ICommunityChatRoomEntity | null>;
}
