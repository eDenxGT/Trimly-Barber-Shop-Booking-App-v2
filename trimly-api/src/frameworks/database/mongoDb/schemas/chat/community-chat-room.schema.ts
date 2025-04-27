import { Schema, model } from "mongoose";
import { ICommunityChatRoomModel } from "./../../models/chat/community-chat-room.model.js";

export const communityChatRoomSchema = new Schema<ICommunityChatRoomModel>(
  {
    communityId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
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
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    createdBy: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);
