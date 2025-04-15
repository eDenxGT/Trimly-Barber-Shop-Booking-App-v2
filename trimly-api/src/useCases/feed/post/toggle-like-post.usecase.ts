import { injectable, inject } from "tsyringe";
import { IToggleLikePostUseCase } from "../../../entities/useCaseInterfaces/feed/post/toggle-like-post-usecase.interface.js";
import { IPostRepository } from "../../../entities/repositoryInterfaces/feed/post-repository.interface.js";
import { CustomError } from "../../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";

@injectable()
export class ToggleLikePostUseCase implements IToggleLikePostUseCase {
  constructor(
    @inject("IPostRepository") private _postRepository: IPostRepository
  ) {}

  async execute({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }): Promise<boolean | null> {
    let post = await this._postRepository.findOne({ postId });
    if (!post) {
      throw new CustomError(
        ERROR_MESSAGES.POST_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    let liked = post?.likes.includes(userId) || false;

    if (liked) {
      post = await this._postRepository.removeLike({ postId, userId });
    } else {
      post = await this._postRepository.addLike({ postId, userId });
    }

    return !liked;
  }
}
