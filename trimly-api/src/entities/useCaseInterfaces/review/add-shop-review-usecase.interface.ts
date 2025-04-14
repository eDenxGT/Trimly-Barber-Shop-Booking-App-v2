export interface IAddShopReviewUseCase {
  execute(
    shopId: string,
    userId: string,
    rating: number,
    reviewText: string
  ): Promise<void>;
}
