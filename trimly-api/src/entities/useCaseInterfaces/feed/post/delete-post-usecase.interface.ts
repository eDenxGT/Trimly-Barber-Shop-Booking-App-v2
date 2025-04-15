export interface IDeletePostUseCase {
  execute({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }): Promise<void>;
}
