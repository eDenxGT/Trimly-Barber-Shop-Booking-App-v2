export interface IAddCommentUseCase {
  execute({
    userId,
    postId,
    comment,
  }: {
    userId: string;
    postId: string;
    comment: string;
  }): Promise<void>;
}
