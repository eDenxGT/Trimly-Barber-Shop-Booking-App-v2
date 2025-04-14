export interface IPost {
  postId?: string;
  barberId?: string;
  caption: string;
  description: string;
  image: string;
  likes?: string[];
  status?: "active" | "blocked";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComment {
  commentId?: string;
  postId?: string;
  userId?: string;
  commentText: string;
  likes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type IPostFormData = {
  caption: string;
  description: string;
  image: string;
};
