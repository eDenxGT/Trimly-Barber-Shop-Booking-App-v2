export interface IPost {
  postId?: string;
  barberId?: string;
  caption: string;
  description: string;
  image: string;
  userDetails?: {
    fullName: string;
    avatar: string;
  };
  isLiked?: boolean;
  likesCount?: number;
  likes?: string[];
  comments?: IComment[];
  totalComments?: number;
  status?: "active" | "blocked";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComment {
  commentId?: string;
  postId?: string;
  userId?: string;
  commentText: string;
  userDetails?: {
    fullName: string;
    avatar: string;
  };
  likes?: string[];
  isCommentLiked?: boolean;
  likesCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IPostFormData = {
  caption: string;
  description: string;
  image: string;
};
