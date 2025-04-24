import { Schema } from "mongoose";
import { IChatRoomModel } from "../../models/chat/chat-room.model.js";

export const chatRoomSchema = new Schema<IChatRoomModel>(
  {
    clientId: { type: String, required: true },
    barberId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
