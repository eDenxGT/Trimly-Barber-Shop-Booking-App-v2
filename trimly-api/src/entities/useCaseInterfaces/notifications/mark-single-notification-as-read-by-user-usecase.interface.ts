export interface IMarkSingleNotificationAsReadByUserUseCase {
  execute({
    userId,
    notificationId,
  }: {
    userId: string;
    notificationId: string;
  }): Promise<void>;
}
