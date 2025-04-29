export interface IReadDirectMessageUseCase {
  execute({
    chatRoomId,
    userId,
  }: {
    chatRoomId: string;
    userId: string;
  }): Promise<any>;
}
