import { inject, injectable } from "tsyringe";
import { IPostRepository } from "../../../entities/repositoryInterfaces/feed/post-repository.interface.js";
import { IGetPostLikedUsersUseCase } from "../../../entities/useCaseInterfaces/feed/post/get-post-liked-users-usecase.interface.js";

@injectable()
export class GetPostLikedUsersUseCase
  implements IGetPostLikedUsersUseCase
{
  constructor(
    @inject("IPostRepository") private _postRepository: IPostRepository
  ) {}

  async execute({
    postId,
  }: {
    postId: string;
  }): Promise<{
    userId: string;
    fullName: string;
    avatar?: string;
  }[]> {
    const likedUsers = await this._postRepository.getLikedUsers({ postId });
    return likedUsers;
  }
}
