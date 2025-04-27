import { inject, injectable } from "tsyringe";
import { IChatRoomRepository } from "../../../entities/repositoryInterfaces/chat/direct-chat/chat-room-repository.interface.js";
import { IChatRoomEntity } from "../../../entities/models/chat/chat-room.entity.js";
import { IGetAllChatsByUserUseCase } from "../../../entities/useCaseInterfaces/chat/direct-chat/get-all-chats-by-user.usecase.interface.js";

@injectable()
export class GetAllChatsByUserUseCase implements IGetAllChatsByUserUseCase {
  constructor(
    @inject("IChatRoomRepository")
    private readonly _chatRoomRepository: IChatRoomRepository
  ) {}
  async execute(
    userId: string,
    role: "client" | "barber"
  ): Promise<IChatRoomEntity[]> {
    const chats = await this._chatRoomRepository.getAllChatsByUserId(
      userId,
      role
    );
    return chats;
  }
}
