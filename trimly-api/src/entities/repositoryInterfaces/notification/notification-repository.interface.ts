import { IBaseRepository } from "../base-repository.interface.js";
import { INotificationEntity } from "../../models/notification.entity.js";

export interface INotificationRepository
  extends IBaseRepository<INotificationEntity> {
  getNotificationsByUser({
    userId,
  }: {
    userId: string;
  }): Promise<INotificationEntity[]>;

  markAllNotificationsAsReadByUser({
    userId,
  }: {
    userId: string;
  }): Promise<void>;
}
