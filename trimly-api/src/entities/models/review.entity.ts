export interface IReviewEntity {
	reviewId?: string;
	reviewerId: string;
	targetId: string;
	rating: number;
	reviewText?: string;
	createdAt: Date;
}
