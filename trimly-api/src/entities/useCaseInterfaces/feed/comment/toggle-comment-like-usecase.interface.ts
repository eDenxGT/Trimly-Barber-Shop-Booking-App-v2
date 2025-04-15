export interface IToggleCommentLikeUseCase {
  execute({
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  }): Promise<boolean>;
}
