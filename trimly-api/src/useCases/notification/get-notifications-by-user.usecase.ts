import { inject, injectable } from "tsyringe";
import { INotificationEntity } from "../../entities/models/notification.entity.js";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/notification-repository.interface.js";
import { IGetNotificationsByUserUseCase } from "../../entities/useCaseInterfaces/notifications/get-notifications-by-user-usecase.interface.js";

@injectable()
export class GetNotificationsByUserUseCase
  implements IGetNotificationsByUserUseCase
{
  constructor(
    @inject("INotificationRepository")
    private _notificationRepository: INotificationRepository
  ) {}
  async execute({
    userId,
  }: {
    userId: string;
  }): Promise<INotificationEntity[]> {
    const notifications =
      await this._notificationRepository.getNotificationsByUser({
        userId,
      });
    return notifications;
  }
}
