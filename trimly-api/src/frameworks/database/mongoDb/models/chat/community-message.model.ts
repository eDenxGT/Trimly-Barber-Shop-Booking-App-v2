import { Document, model, ObjectId } from "mongoose";
import { ICommunityMessageEntity } from "../../../../../entities/models/chat/community-message.entity.js";
import { communityMessageSchema } from "../../schemas/chat/community-message.schema.js";

export interface ICommunityMessageModel
  extends ICommunityMessageEntity,
    Document {
  _id: ObjectId;
}

export const CommunityMessageModel = model<ICommunityMessageModel>(
  "CommunityMessage",
  communityMessageSchema
);
