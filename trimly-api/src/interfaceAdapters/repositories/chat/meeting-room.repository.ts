import { injectable } from "tsyringe";
import {
  IMeetingRoomModel,
  MeetingRoomModel,
} from "../../../frameworks/database/mongoDb/models/chat/meeting-room.model.js";
import { BaseRepository } from "../base.repository.js";
import { IMeetingRoomRepository } from "../../../entities/repositoryInterfaces/chat/meeting-room-repository.interface.js";

@injectable()
export class MeetingRoomRepository
  extends BaseRepository<IMeetingRoomModel>
  implements IMeetingRoomRepository
{
  constructor() {
    super(MeetingRoomModel);
  }
}
