export interface ISendNotificationByUserUseCase {
  execute({
    receiverId,
    message,
  }: {
    receiverId: string;
    message: string;
  }): Promise<void>;
}
