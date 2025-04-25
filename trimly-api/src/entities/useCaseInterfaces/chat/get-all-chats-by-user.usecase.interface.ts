import { IChatRoomEntity } from "../../models/chat/chat-room.entity.js";

export interface IGetAllChatsByUserUseCase {
  execute(
    userId: string,
    role: "client" | "barber"
  ): Promise<IChatRoomEntity[]>;
}
