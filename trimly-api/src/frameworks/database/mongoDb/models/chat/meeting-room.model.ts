import { Document, model, ObjectId } from "mongoose";
import { IMeetingRoomEntity } from "../../../../../entities/models/chat/meeting-room.entity.js";
import { meetingRoomSchema } from "../../schemas/chat/meeting-room.schema.js";

export interface IMeetingRoomModel extends IMeetingRoomEntity, Document {
  _id: ObjectId;
}

export const MeetingRoomModel = model<IMeetingRoomModel>(
  "MeetingRoom",
  meetingRoomSchema
);
