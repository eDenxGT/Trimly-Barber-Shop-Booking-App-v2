import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity.js";

export interface IGetCommunityByCommunityIdUseCase {
  execute(communityId: string): Promise<ICommunityChatRoomEntity | null>;
}
