import { inject, injectable } from "tsyringe";
import { IPostRepository } from "../../../entities/repositoryInterfaces/feed/post-repository.interface.js";
import { IGetAllPostsForClientUseCase } from "../../../entities/useCaseInterfaces/feed/post/get-all-posts-for-client-usecase.interface.js";
import { IPostEntity } from "../../../entities/models/post.entity.js";

@injectable()
export class GetAllPostsForClientUseCase
  implements IGetAllPostsForClientUseCase
{
  constructor(
    @inject("IPostRepository") private _postRepository: IPostRepository
  ) {}
  async execute(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ items: IPostEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    return await this._postRepository.findAllPosts(
      {
        status: "active",
      },
      skip,
      limit,
      userId
    );
  }
}
