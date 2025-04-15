import { inject, injectable } from "tsyringe";
import { IGetSinglePostByPostIdUseCase } from "../../entities/useCaseInterfaces/feed/get-single-post-by-postid-usecase.interface.js";
import { IPostEntity } from "../../entities/models/post.entity.js";
import { IPostRepository } from "../../entities/repositoryInterfaces/feed/post-repository.interface.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";

@injectable()
export class GetSinglePostByPostIdUseCase
  implements IGetSinglePostByPostIdUseCase
{
  constructor(
    @inject("IPostRepository") private _postRepository: IPostRepository
  ) {}
  async execute(
    userId: string,
    role: string,
    postId: string
  ): Promise<IPostEntity> {
    const filter: Partial<IPostEntity> | null =
      role === "barber"
        ? { postId, barberId: userId }
        : role === "client"
        ? { postId, status: "active" }
        : null;

    if (!filter) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_ROLE,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    
    const post = await this._postRepository.getSinglePostByPostId(filter);
    if (!post) {
      throw new CustomError(
        ERROR_MESSAGES.POST_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return post;
  }
}
