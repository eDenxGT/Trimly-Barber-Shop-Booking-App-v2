import { injectable } from "tsyringe";
import { ICommentRepository } from "../../../entities/repositoryInterfaces/feed/comment-repository.interface.js";
import { CommentModel, ICommentModel } from "../../../frameworks/database/mongoDb/models/comment.model.js";
import { BaseRepository } from "../base.repository.js";

@injectable()
export class CommentRepository
  extends BaseRepository<ICommentModel>
  implements ICommentRepository {
      constructor() {
        super(CommentModel);
      }
  }
