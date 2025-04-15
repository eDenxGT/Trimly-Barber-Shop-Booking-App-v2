export interface IUpdatePostStatusUseCase {
  execute(postId: string, userId: string): Promise<void>;
}
