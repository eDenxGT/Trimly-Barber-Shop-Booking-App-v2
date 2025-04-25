import { IChatRoomEntity } from "../../models/chat/chat-room.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IChatRoomRepository extends IBaseRepository<IChatRoomEntity> {
  getChatRoomByUserId(
    opponentUserId: string,
    currentUserId: string,
    currentUserRole: string
  ): Promise<IChatRoomEntity | null>;
}
