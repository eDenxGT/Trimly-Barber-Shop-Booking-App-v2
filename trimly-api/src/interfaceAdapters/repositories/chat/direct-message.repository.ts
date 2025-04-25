import { injectable } from "tsyringe";
import {
  DirectMessageModel,
  IDirectMessageModel,
} from "../../../frameworks/database/mongoDb/models/chat/direct-message.model.js";
import { BaseRepository } from "../base.repository.js";
import { IDirectMessageRepository } from "../../../entities/repositoryInterfaces/chat/direct-message.repository.js";

@injectable()
export class DirectMessageRepository
  extends BaseRepository<IDirectMessageModel>
  implements IDirectMessageRepository
{
  constructor() {
    super(DirectMessageModel);
  }
}
