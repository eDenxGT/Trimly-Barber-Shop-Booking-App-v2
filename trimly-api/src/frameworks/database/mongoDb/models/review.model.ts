import { Document, model, ObjectId } from "mongoose";
import { IReviewEntity } from "../../../../entities/models/review.entity.js";
import { reviewSchema } from "../schemas/review.schema.js";

export interface IReviewModel extends IReviewEntity, Document {
  _id: ObjectId;
}

export const ReviewModel = model<IReviewModel>("Review", reviewSchema);
