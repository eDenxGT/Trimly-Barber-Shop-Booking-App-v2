import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository.js";
import { IPostRepository } from "../../../entities/repositoryInterfaces/feed/post-repository.interface.js";
import { IPostModel, PostModel } from "../../../frameworks/database/mongoDb/models/post.model.js";

@injectable()
export class PostRepository
  extends BaseRepository<IPostModel>
  implements IPostRepository {
      constructor() {
        super(PostModel);
      }
  }
