import { inject, injectable } from "tsyringe";
import { IPostRepository } from "../../../entities/repositoryInterfaces/feed/post-repository.interface.js";
import { CustomError } from "../../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";
import { IUpdatePostStatusUseCase } from "../../../entities/useCaseInterfaces/feed/post/update-post-status-usecase.interface.js";

@injectable()
export class UpdatePostStatusUseCase implements IUpdatePostStatusUseCase {
  constructor(
    @inject("IPostRepository") private _postRepository: IPostRepository
  ) {}
  async execute(postId: string, userId: string): Promise<void> {
    const post = await this._postRepository.findOne({
      postId,
      barberId: userId,
    });
    if (!post) {
      throw new CustomError(
        ERROR_MESSAGES.POST_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    const status = post.status === "active" ? "blocked" : "active";

    await this._postRepository.update(
      {
        postId,
        barberId: userId,
      },
      { status }
    );
  }
}
