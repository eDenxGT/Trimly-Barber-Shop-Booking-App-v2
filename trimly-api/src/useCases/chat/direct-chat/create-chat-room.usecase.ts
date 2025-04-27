import { inject, injectable } from "tsyringe";
import { ICreateChatRoomUseCase } from "../../../entities/useCaseInterfaces/chat/direct-chat/create-chat-room-usecase.interface.js";
import { IChatRoomRepository } from "../../../entities/repositoryInterfaces/chat/direct-chat/chat-room-repository.interface.js";
import { IChatRoomEntity } from "../../../entities/models/chat/chat-room.entity.js";
import { generateUniqueId } from "../../../shared/utils/unique-uuid.helper.js";

@injectable()
export class CreateChatRoomUseCase implements ICreateChatRoomUseCase {
  constructor(
    @inject("IChatRoomRepository")
    private _chatRoomRepository: IChatRoomRepository
  ) {}
  async execute({
    clientId,
    barberId,
  }: {
    clientId: string;
    barberId: string;
  }): Promise<IChatRoomEntity> {
    const newChat = await this._chatRoomRepository.save({
      chatRoomId: generateUniqueId("chat"),
      clientId,
      barberId,
    });
    return newChat;
  }
}
