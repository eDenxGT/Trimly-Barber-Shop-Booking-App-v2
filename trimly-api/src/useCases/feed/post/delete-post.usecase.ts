import { inject, injectable } from "tsyringe";
import { IDeletePostUseCase } from "../../../entities/useCaseInterfaces/feed/post/delete-post-usecase.interface.js";
import { IPostRepository } from "../../../entities/repositoryInterfaces/feed/post-repository.interface.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";
import { CustomError } from "../../../entities/utils/custom.error.js";

@injectable()
export class DeletePostUseCase implements IDeletePostUseCase {
  constructor(
    @inject("IPostRepository") private _postRepository: IPostRepository
  ) {}
  async execute({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }): Promise<void> {
    const deletedPost = await this._postRepository.delete({
      postId,
      barberId: userId,
    });
    if (!deletedPost) {
      throw new CustomError(
        ERROR_MESSAGES.POST_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
  }
}
