export interface ICommentEntity {
  commentId: string;
  postId: string;
  userId: string;
  commentText: string;
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
}
