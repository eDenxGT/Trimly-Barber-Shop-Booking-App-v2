import { IBaseRepository } from "../base-repository.interface.js";
import { IPostEntity } from "../../models/post.entity.js";

export interface IPostRepository extends IBaseRepository<IPostEntity> {
  findAllPosts(
    filter: Partial<IPostEntity>,
    skip: number,
    limit: number
  ): Promise<{ items: IPostEntity[]; total: number }>;
  getSinglePostByPostId(
    filter: Partial<IPostEntity>
  ): Promise<IPostEntity | null>;
}
