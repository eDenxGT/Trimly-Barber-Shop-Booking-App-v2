export interface IUpdatePostUseCase {
  execute({
    userId,
    postId,
    caption,
    description,
    image,
  }: {
    userId: string;
    postId: string;
    caption: string;
    description: string;
    image: string;
  }): Promise<void>;
}
