import { Schema } from "mongoose";
import { IReviewModel } from "../models/review.model.js";

export const reviewSchema = new Schema<IReviewModel>({
  reviewId: {
    type: String,
    required: true,
  },
  shopId: {
    type: String,
    required: true,
  },
  reviewerId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
});
