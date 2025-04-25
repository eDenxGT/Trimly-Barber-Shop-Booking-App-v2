import { IDirectMessageEntity } from "../../models/chat/direct-message.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IDirectMessageRepository
  extends IBaseRepository<IDirectMessageEntity> {}
