import { Schema } from "mongoose";
import { ICommentModel } from "../models/comment.model.js";

export const commentSchema = new Schema<ICommentModel>(
  {
    commentId: { type: String, required: true, unique: true },
    postId: { type: String, required: true, ref: "Post" },
    userId: { type: String, required: true },
    commentText: { type: String, required: true },
    likes: [{ type: String }],
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ likes: 1 });
commentSchema.index({ createdAt: -1 });
