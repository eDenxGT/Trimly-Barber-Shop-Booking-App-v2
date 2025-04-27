import { ICommunityMessageEntity } from "../../../models/chat/community-message.entity.js";
import { IBaseRepository } from "../../base-repository.interface.js";

export interface ICommunityMessageRepository
  extends IBaseRepository<ICommunityMessageEntity> {}
