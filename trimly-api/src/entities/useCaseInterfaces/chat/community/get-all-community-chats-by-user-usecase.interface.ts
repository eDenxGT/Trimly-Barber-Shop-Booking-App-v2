import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity.js";

export interface IGetAllCommunityChatsByUserUseCase {
  execute({ userId }: { userId: string }): Promise<Partial<ICommunityChatRoomEntity>[]>;
}
