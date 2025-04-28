import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity.js";

export interface IGetCommunityForEditUseCase {
  execute(communityId: string): Promise<ICommunityChatRoomEntity>;
}
