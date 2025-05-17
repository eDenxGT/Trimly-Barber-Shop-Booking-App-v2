import { inject, injectable } from "tsyringe";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/notification-repository.interface.js";
import { IMarkAllNotificationsAsReadByUserUseCase } from "../../entities/useCaseInterfaces/notifications/mark-all-notifications-as-read-by-user-usecase.interface.js";

@injectable()
export class MarkAllNotificationsAsReadByUserUseCase
  implements IMarkAllNotificationsAsReadByUserUseCase
{
  constructor(
    @inject("INotificationRepository")
    private _notificationRepository: INotificationRepository
  ) {}

  async execute({ userId }: { userId: string }): Promise<void> {
    await this._notificationRepository.markAllNotificationsAsReadByUser({
      userId,
    });
  }
}
