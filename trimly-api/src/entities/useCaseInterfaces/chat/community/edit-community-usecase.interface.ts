import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity.js";

export interface IEditCommunityUseCase {
  execute(data: Partial<ICommunityChatRoomEntity>): Promise<void>;
}
