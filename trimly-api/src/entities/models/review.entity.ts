export interface IReviewEntity {
	reviewId?: string;
	reviewerId: string;
	shopId: string;
	rating: number;
	reviewText?: string;
	createdAt: Date;
}
