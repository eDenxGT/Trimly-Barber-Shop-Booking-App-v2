import { model, ObjectId } from "mongoose";
import { ICommentEntity } from "../../../../entities/models/comment.entity.js";
import { commentSchema } from "../schemas/comment.schema.js";

export interface ICommentModel extends ICommentEntity, Document {
  _id: ObjectId;
}

export const CommentModel = model<ICommentModel>("Comment", commentSchema);
