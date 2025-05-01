import { injectable } from "tsyringe";
import {
  IReviewModel,
  ReviewModel,
} from "../../../frameworks/database/mongoDb/models/review.model.js";
import { BaseRepository } from "../base.repository.js";
import { IReviewRepository } from "../../../entities/repositoryInterfaces/review/review-repository.interface.js";
import { IBarberDashboardResponse } from "../../../shared/dtos/dashboard-data.dto.js";

@injectable()
export class ReviewRepository
  extends BaseRepository<IReviewModel>
  implements IReviewRepository
{
  constructor() {
    super(ReviewModel);
  }

  async getReviewStatsByShopId({
    shopId,
  }: {
    shopId: string;
  }): Promise<{ averageRating: number; totalReviews: number }> {
    const result = await ReviewModel.aggregate([
      {
        $match: { shopId },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    return {
      averageRating: Number(result[0]?.averageRating?.toFixed(1) || 0),
      totalReviews: result[0]?.totalReviews || 0,
    };
  }

  async getLatestReviews(
    shopId: string
  ): Promise<IBarberDashboardResponse["latestReviews"]> {
    return ReviewModel.aggregate([
      { $match: { shopId } },
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "clients",
          localField: "reviewerId",
          foreignField: "userId",
          as: "client",
        },
      },
      { $unwind: "$client" },
      {
        $project: {
          reviewId: 1,
          rating: 1,
          comment: "$reviewText",
          createdAt: 1,
          clientName: "$client.fullName",
          clientAvatar: "$client.avatar",
        },
      },
    ]);
  }
}
