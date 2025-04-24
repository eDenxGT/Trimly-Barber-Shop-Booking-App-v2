import { Schema } from "mongoose";
import { IDirectMessageModel } from "../../models/chat/direct-message.model.js";

export const directMessageSchema = new Schema<IDirectMessageModel>(
  {
    messageId: { type: String, required: true },
    chatRoomId: {
      type: String,
      required: true,
    },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio"],
      required: true,
    },
    content: { type: String, default: null },
    mediaUrl: { type: String, default: null },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  {
    timestamps: { createdAt: "timestamp", updatedAt: false },
  }
);
