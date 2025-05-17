import { inject, injectable } from "tsyringe";
import { ISendNotificationByUserUseCase } from "../../entities/useCaseInterfaces/notifications/send-notification-by-user-usecase.interface.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/notification-repository.interface.js";
import { INotificationSocketHandler } from "../../entities/socketHandlerInterfaces/notification-handler.interface.js";

@injectable()
export class SendNotificationByUserUseCase
  implements ISendNotificationByUserUseCase
{
  constructor(
    @inject("INotificationRepository")
    private _notificationRepository: INotificationRepository,
    @inject("INotificationSocketHandler")
    private _notificationSocketHandler: INotificationSocketHandler
  ) {}

  async execute({
    receiverId,
    message,
  }: {
    receiverId: string;
    message: string;
  }): Promise<void> {
    const notification = {
      notificationId: generateUniqueId("notification"),
      userId: receiverId,
      message,
      isRead: false,
      createdAt: new Date(),
    };

    await this._notificationRepository.save(notification);

    await this._notificationSocketHandler.handleSendNotificationByUserId({
      receiverId,
      payload: notification,
    });
  }
}
