import { Schema } from "mongoose";
import { IPostModel } from "../models/post.model.js";

export const postSchema = new Schema<IPostModel>(
  {
    postId: { type: String, required: true, unique: true },
    barberId: { type: String, required: true },
    caption: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    likes: [{ type: String }],
    status: { type: String, enum: ["active", "blocked"], default: "active" },
  },
  { timestamps: true }
);

postSchema.index({ likes: 1 });
postSchema.index({ barberId: 1 });
postSchema.index({ status: 1 });
