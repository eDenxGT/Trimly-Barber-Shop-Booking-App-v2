import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository.js";
import {
  INotificationModel,
  NotificationModel,
} from "../../../frameworks/database/mongoDb/models/notification.model.js";
import { INotificationRepository } from "../../../entities/repositoryInterfaces/notification/notification-repository.interface.js";
import { INotificationEntity } from "../../../entities/models/notification.entity.js";

@injectable()
export class NotificationRepository
  extends BaseRepository<INotificationModel>
  implements INotificationRepository
{
  constructor() {
    super(NotificationModel);
  }
  async getNotificationsByUser({
    userId,
  }: {
    userId: string;
  }): Promise<INotificationEntity[]> {
    return await NotificationModel.find({ userId }).sort({ createdAt: -1 });
  }

  async markAllNotificationsAsReadByUser({
    userId,
  }: {
    userId: string;
  }): Promise<void> {
    await NotificationModel.updateMany(
      { userId },
      { isRead: true },
      { new: true }
    );
  }
}
