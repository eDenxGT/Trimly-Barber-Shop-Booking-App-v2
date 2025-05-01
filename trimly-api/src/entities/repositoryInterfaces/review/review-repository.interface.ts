import { IBarberDashboardResponse } from "../../../shared/dtos/dashboard-data.dto.js";
import { IReviewEntity } from "../../models/review.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IReviewRepository extends IBaseRepository<IReviewEntity> {
  getReviewStatsByShopId({
    shopId,
  }: {
    shopId: string;
  }): Promise<{ averageRating: number; totalReviews: number }>;

  getLatestReviews(
      shopId: string
    ): Promise<IBarberDashboardResponse["latestReviews"]>
}
