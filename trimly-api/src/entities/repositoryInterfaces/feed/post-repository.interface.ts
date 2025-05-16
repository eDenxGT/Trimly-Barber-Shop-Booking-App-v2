import { IBaseRepository } from "../base-repository.interface.js";
import { IPostEntity } from "../../models/post.entity.js";
import { IClientEntity } from "../../models/client.entity.js";

export interface IPostRepository extends IBaseRepository<IPostEntity> {
  findAllPosts(
    filter: Partial<IPostEntity>,
    skip: number,
    limit: number,
    userId: string,
    isForClient?: boolean
  ): Promise<{ items: IPostEntity[]; total: number }>;

  getSinglePostByPostId(
    filter: Partial<IPostEntity>,
    userId: string
  ): Promise<IPostEntity | null>;

  addLike({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }): Promise<IPostEntity | null>;

  removeLike({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }): Promise<IPostEntity | null>;

  getLikedUsers({ postId }: { postId: string }): Promise<
    {
      userId: string;
      fullName: string;
      avatar?: string;
    }[]
  >;
}
