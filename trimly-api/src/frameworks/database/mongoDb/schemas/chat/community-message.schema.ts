import { Schema } from "mongoose";
import { ICommunityMessageModel } from "../../models/chat/community-message.model.js";

export const communityMessageSchema = new Schema<ICommunityMessageModel>(
  {
    messageId: { type: String, required: true },
    communityId: {
      type: String,
      ref: "CommunityChatRoom",
      required: true,
    },
    senderId: { type: String, ref: "Barber", required: true },
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
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "Barber",
      },
    ],
  },
  {
    timestamps: { createdAt: "timestamp", updatedAt: false },
  }
);
