import { ObjectId } from "mongoose";
import { ICommunityChatRoomEntity } from "../../../../../entities/models/chat/community-chat-room.entity.js";
import { Document } from "mongoose";

export interface ICommunityChatRoomModel
  extends ICommunityChatRoomEntity,
    Document {
  _id: ObjectId;
}
