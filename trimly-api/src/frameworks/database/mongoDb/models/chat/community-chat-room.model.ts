import { model, ObjectId } from "mongoose";
import { ICommunityChatRoomEntity } from "../../../../../entities/models/chat/community-chat-room.entity.js";
import { Document } from "mongoose";
import { communityChatRoomSchema } from "../../schemas/chat/community-chat-room.schema.js";

export interface ICommunityChatRoomModel
  extends ICommunityChatRoomEntity,
    Document {
  _id: ObjectId;
}

export const CommunityModel = model<ICommunityChatRoomModel>(
  "Community",
  communityChatRoomSchema
);
