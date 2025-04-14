import { inject, injectable } from "tsyringe";
import { IAddShopReviewUseCase } from "../../entities/useCaseInterfaces/review/add-shop-review-usecase.interface.js";
import { IReviewRepository } from "../../entities/repositoryInterfaces/review/review-repository.interface.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";

@injectable()
export class AddShopReviewUseCase implements IAddShopReviewUseCase {
  constructor(
    @inject("IReviewRepository")
    private _reviewRepository: IReviewRepository
  ) {}

  async execute(
    shopId: string,
    userId: string,
    rating: number,
    reviewText: string
  ): Promise<void> {
    const isReviewExisting = await this._reviewRepository.findOne({
      shopId,
      reviewerId: userId,
    });

    if (isReviewExisting) {
      throw new CustomError(
        ERROR_MESSAGES.REVIEW_EXISTING,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this._reviewRepository.save({
      reviewId: generateUniqueId("review"),
      shopId,
      reviewerId: userId,
      rating,
      reviewText,
      createdAt: new Date(),
    });
  }
}
