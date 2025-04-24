import { ObjectId } from "mongoose";
import { Document } from "mongoose";
import { ICommunityMessageEntity } from "../../../../../entities/models/chat/community-message.entity.js";

export interface ICommunityMessageModel
  extends ICommunityMessageEntity,
    Document {
  _id: ObjectId;
}
