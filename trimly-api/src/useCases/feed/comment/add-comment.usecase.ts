import { inject, injectable } from "tsyringe";
import { IAddCommentUseCase } from "../../../entities/useCaseInterfaces/feed/comment/add-comment-usecase.interface.js";
import { ICommentRepository } from "../../../entities/repositoryInterfaces/feed/comment-repository.interface.js";
import { generateUniqueId } from "../../../shared/utils/unique-uuid.helper.js";

@injectable()
export class AddCommentUseCase implements IAddCommentUseCase {
  constructor(
    @inject("ICommentRepository") private _commentRepository: ICommentRepository
  ) {}
  async execute({
    userId,
    postId,
    comment,
  }: {
    userId: string;
    postId: string;
    comment: string;
  }): Promise<void> {
    await this._commentRepository.save({
      commentId: generateUniqueId("comment"),
      userId,
      postId,
      commentText: comment,
    });
  }
}
