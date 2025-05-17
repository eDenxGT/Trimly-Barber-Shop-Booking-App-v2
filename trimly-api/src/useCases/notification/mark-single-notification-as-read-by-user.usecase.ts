import { inject, injectable } from "tsyringe";
import { IMarkSingleNotificationAsReadByUserUseCase } from "../../entities/useCaseInterfaces/notifications/mark-single-notification-as-read-by-user-usecase.interface.js";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/notification-repository.interface.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";

@injectable()
export class MarkSingleNotificationAsReadByUserUseCase
  implements IMarkSingleNotificationAsReadByUserUseCase
{
  constructor(
    @inject("INotificationRepository")
    private _notificationRepository: INotificationRepository
  ) {}

  async execute({
    userId,
    notificationId,
  }: {
    userId: string;
    notificationId: string;
  }): Promise<void> {
    const notification = await this._notificationRepository.update(
      {
        notificationId,
      },
      {
        isRead: true,
      }
    );

    if (!notification) {
      throw new CustomError(
        ERROR_MESSAGES.NOTIFICATION_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
  }
}
