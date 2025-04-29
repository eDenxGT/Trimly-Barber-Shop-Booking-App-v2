import { Schema } from "mongoose";
import { IMeetingRoomModel } from "../../models/chat/meeting-room.model.js";

export const meetingRoomSchema = new Schema<IMeetingRoomModel>(
  {
    meetingId: { type: String, required: true },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    communityId: { type: String, required: true },
    scheduledBy: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    meetLink: {
      type: String,
    },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);
