import { model, ObjectId } from "mongoose";
import { IPostEntity } from "../../../../entities/models/post.entity.js";
import { postSchema } from "../schemas/post.schema.js";

export interface IPostModel extends IPostEntity, Document {
  _id: ObjectId;
}

export const PostModel = model<IPostModel>("Post", postSchema);
