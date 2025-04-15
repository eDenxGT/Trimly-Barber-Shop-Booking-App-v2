import { inject, injectable } from "tsyringe";
import { IAddPostUseCase } from "../../../entities/useCaseInterfaces/feed/post/add-post-usecase.interface.js";
import { generateUniqueId } from "../../../shared/utils/unique-uuid.helper.js";
import { IPostRepository } from "../../../entities/repositoryInterfaces/feed/post-repository.interface.js";

@injectable()
export class AddPostUseCase implements IAddPostUseCase {
  constructor(
    @inject("IPostRepository") private _postRepository: IPostRepository
  ) {}

  async execute(
    userId: string,
    caption: string,
    description: string,
    image: string
  ): Promise<void> {
    await this._postRepository.save({
      postId: generateUniqueId("post"),
      barberId: userId,
      caption,
      description,
      image,
      status: "active",
    });
  }
}
