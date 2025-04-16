import { IPostEntity } from "../../../models/post.entity.js";

export interface IGetAllPostsForClientUseCase {
  execute(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ items: IPostEntity[]; total: number }>;
}
