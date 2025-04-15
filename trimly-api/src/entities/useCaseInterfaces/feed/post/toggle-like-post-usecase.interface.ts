import { IPostEntity } from "../../../models/post.entity.js";

export interface IToggleLikePostUseCase {
  execute({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }): Promise<boolean | null>;
}
