import { IChatRoomEntity } from "../../../models/chat/chat-room.entity.js";

export interface IGetChatByChatIdUseCase {
  execute(chatId: string, role: "client" | "barber"): Promise<IChatRoomEntity>;
}
