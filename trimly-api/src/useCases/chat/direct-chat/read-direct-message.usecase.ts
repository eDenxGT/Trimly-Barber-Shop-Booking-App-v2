import { inject, injectable } from "tsyringe";
import { IDirectMessageRepository } from "../../../entities/repositoryInterfaces/chat/direct-chat/direct-message.repository.js";
import { IReadDirectMessageUseCase } from "../../../entities/useCaseInterfaces/chat/direct-chat/read-direct-message-usecase.interface.js";

@injectable()
export class ReadDirectMessageUseCase implements IReadDirectMessageUseCase {
  constructor(
    @inject("IDirectMessageRepository")
    private _directMessageRepository: IDirectMessageRepository
  ) {}

  async execute({
    chatRoomId,
    userId,
  }: {
    chatRoomId: string;
    userId: string;
  }) {
    return this._directMessageRepository.markMessagesAsRead({
      chatRoomId,
      userId,
    });
  }
}
