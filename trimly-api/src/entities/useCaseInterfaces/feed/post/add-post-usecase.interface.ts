export interface IAddPostUseCase {
  execute(
    userId: string,
    caption: string,
    description: string,
    image: string
  ): Promise<void>;
}
