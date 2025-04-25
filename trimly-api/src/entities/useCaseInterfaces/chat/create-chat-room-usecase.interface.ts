import { IChatRoomEntity } from "../../models/chat/chat-room.entity.js";

export interface ICreateChatRoomUseCase {
  execute({
    clientId,
    barberId,
  }: {
    clientId: string;
    barberId: string;
  }): Promise<IChatRoomEntity>;
}
