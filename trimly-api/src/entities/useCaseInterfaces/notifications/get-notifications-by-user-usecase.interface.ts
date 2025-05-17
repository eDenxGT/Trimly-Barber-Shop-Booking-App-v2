import { INotificationEntity } from "../../models/notification.entity.js";

export interface IGetNotificationsByUserUseCase {
  execute({ userId }: { userId: string }): Promise<INotificationEntity[]>;
}
