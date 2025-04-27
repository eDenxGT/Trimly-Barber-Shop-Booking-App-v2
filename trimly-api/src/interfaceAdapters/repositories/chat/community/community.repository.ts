import { injectable } from "tsyringe";
import { BaseRepository } from "../../base.repository.js";
import {
  CommunityModel,
  ICommunityChatRoomModel,
} from "../../../../frameworks/database/mongoDb/models/chat/community-chat-room.model.js";
import { ICommunityRepository } from "../../../../entities/repositoryInterfaces/chat/community/community-respository.interface.js";

@injectable()
export class CommunityRepository
  extends BaseRepository<ICommunityChatRoomModel>
  implements ICommunityRepository
{
  constructor() {
    super(CommunityModel);
  }
}
