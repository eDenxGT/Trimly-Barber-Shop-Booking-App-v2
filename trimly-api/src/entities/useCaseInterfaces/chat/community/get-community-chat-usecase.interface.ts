import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity.js";

export interface IGetCommunityChatUseCase {
  execute({
    userId,
    chatId,
  }: {
    userId: string;
    chatId: string;
  }): Promise<ICommunityChatRoomEntity | null>;
}
