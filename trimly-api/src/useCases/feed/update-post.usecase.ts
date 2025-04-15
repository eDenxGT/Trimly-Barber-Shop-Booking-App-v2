import { inject, injectable } from "tsyringe";
import { IUpdatePostUseCase } from "../../entities/useCaseInterfaces/feed/update-post-usecase.interface.js";
import { IPostRepository } from "../../entities/repositoryInterfaces/feed/post-repository.interface.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";

@injectable()
export class UpdatePostUseCase implements IUpdatePostUseCase {
  constructor(
    @inject("IPostRepository") private _postRepository: IPostRepository
  ) {}

  async execute({
    userId,
    postId,
    caption,
    description,
    image,
  }: {
    userId: string;
    postId: string;
    caption: string;
    description: string;
    image: string;
  }): Promise<void> {
    const post = await this._postRepository.update(
      {
        postId,
        barberId: userId,
      },
      {
        caption,
        description,
        image,
      }
    );

    if (!post) {
      throw new CustomError(
        ERROR_MESSAGES.POST_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
  }
}
