export interface IReview {
  reviewId?: string;
  reviewerId?: string;
  shopId: string;
  rating: number;
  reviewText?: string;
  createdAt?: Date;
  reviewer?: {
    fullName: string;
    avatar: string;
  };
}

export interface ReviewDTO {
  shopId: string;
  rating: number;
  reviewText: string;
}
