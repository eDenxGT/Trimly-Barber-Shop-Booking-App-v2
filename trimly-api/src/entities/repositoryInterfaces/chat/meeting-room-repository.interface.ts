import { IMeetingRoomEntity } from "../../models/chat/meeting-room.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IMeetingRoomRepository
  extends IBaseRepository<IMeetingRoomEntity> {}
