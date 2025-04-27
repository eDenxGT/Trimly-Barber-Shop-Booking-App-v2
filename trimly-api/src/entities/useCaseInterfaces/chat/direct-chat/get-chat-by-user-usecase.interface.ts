import { IChatRoomEntity } from "../../../models/chat/chat-room.entity.js";

export interface IGetChatByUserUseCase {
  execute(
    opponentUserId: string,
    currentUserId: string,
    currentUserRole: string
  ): Promise<IChatRoomEntity | null>; 
}
