import { injectable } from "tsyringe";
import { BaseRepository } from "../../base.repository.js";
import { ICommunityMessageRepository } from "../../../../entities/repositoryInterfaces/chat/community/community-message-respository.interface.js";
import {
  CommunityMessageModel,
  ICommunityMessageModel,
} from "../../../../frameworks/database/mongoDb/models/chat/community-message.model.js";
import { ICommunityMessageEntity } from "../../../../entities/models/chat/community-message.entity.js";

@injectable()
export class CommunityMessageRepository
  extends BaseRepository<ICommunityMessageModel>
  implements ICommunityMessageRepository
{
  constructor() {
    super(CommunityMessageModel);
  }

  async saveCommunityMessage(
    data: Partial<ICommunityMessageEntity>
  ): Promise<ICommunityMessageEntity> {
    const createdMessage = await CommunityMessageModel.create(data);
    return createdMessage.toObject();
  }
}
