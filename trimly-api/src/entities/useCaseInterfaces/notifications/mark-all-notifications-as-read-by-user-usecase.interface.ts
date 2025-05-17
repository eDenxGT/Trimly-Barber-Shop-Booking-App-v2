export interface IMarkAllNotificationsAsReadByUserUseCase {
  execute({ userId }: { userId: string }): Promise<void>;
}
