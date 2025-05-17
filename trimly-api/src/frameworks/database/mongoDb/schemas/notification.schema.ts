import { Schema } from "mongoose";
import { INotificationModel } from "../models/notification.model.js";

export const notificationSchema = new Schema<INotificationModel>(
  {
    userId: {
      type: String,
      required: true,
    },
    notificationId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);
