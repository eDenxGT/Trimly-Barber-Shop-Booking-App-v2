import { Schema, model } from "mongoose";
import { ICommunityChatRoomModel } from "./../../models/chat/community-chat-room.model.js";

export const communityChatRoomSchema = new Schema<ICommunityChatRoomModel>(
  {
    communityId: {
      type: String,
      required: true,
    },
    members: [
      {
        type: String,
        ref: "Barber",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);
