import { Document, model, ObjectId } from "mongoose";
import { IChatRoomEntity } from "../../../../../entities/models/chat/chat-room.entity.js";
import { chatRoomSchema } from "../../schemas/chat/chat-room.schema.js";

export interface IChatRoomModel extends IChatRoomEntity, Document {
  _id: ObjectId;
}

export const ChatRoomModel = model<IChatRoomModel>("ChatRoom", chatRoomSchema);
