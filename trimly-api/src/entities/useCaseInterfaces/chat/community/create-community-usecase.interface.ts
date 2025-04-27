import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity.js";

export interface ICreateCommunityUseCase {
  execute(data: Partial<ICommunityChatRoomEntity>): Promise<void>;
}
