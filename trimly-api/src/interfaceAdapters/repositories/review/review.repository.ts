import { injectable } from "tsyringe";
import {
  IReviewModel,
  ReviewModel,
} from "../../../frameworks/database/mongoDb/models/review.model.js";
import { BaseRepository } from "../base.repository.js";
import { IReviewRepository } from "../../../entities/repositoryInterfaces/review/review-repository.interface.js";

@injectable()
export class ReviewRepository
  extends BaseRepository<IReviewModel>
  implements IReviewRepository
{
  constructor() {
    super(ReviewModel);
  }
}
