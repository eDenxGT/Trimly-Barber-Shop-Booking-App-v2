import { IBaseRepository } from "../base-repository.interface.js";
import { ICommentEntity } from "../../models/comment.entity.js";

export interface ICommentRepository extends IBaseRepository<ICommentEntity> {
  addLike({
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  }): Promise<ICommentEntity | null>;

  removeLike({
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  }): Promise<ICommentEntity | null>;
}
