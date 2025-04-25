import { inject, injectable } from "tsyringe";
import { IGetChatByUserUseCase } from "../../entities/useCaseInterfaces/chat/get-chat-by-user-usecase.interface.js";
import { IChatRoomEntity } from "../../entities/models/chat/chat-room.entity.js";
import { IChatRoomRepository } from "../../entities/repositoryInterfaces/chat/chat-room-repository.interface.js";
import { ICreateChatRoomUseCase } from "../../entities/useCaseInterfaces/chat/create-chat-room-usecase.interface.js";

@injectable()
export class GetChatByUserUseCase implements IGetChatByUserUseCase {
  constructor(
    @inject("IChatRoomRepository")
    private readonly _chatRoomRepository: IChatRoomRepository,
    @inject("ICreateChatRoomUseCase")
    private readonly _createChatRoomUseCase: ICreateChatRoomUseCase
  ) {}

  async execute(
    opponentUserId: string,
    currentUserId: string,
    currentUserRole: "client" | "barber"
  ): Promise<IChatRoomEntity | null> {
    const isClient = currentUserRole === "client";

    const isChatRoomExists = await this._chatRoomRepository.findOne({
      clientId: isClient ? currentUserId : opponentUserId,
      barberId: isClient ? opponentUserId : currentUserId,
    });

    if (!isChatRoomExists) {
      await this._createChatRoomUseCase.execute({
        clientId: isClient ? currentUserId : opponentUserId,
        barberId: isClient ? opponentUserId : currentUserId,
      });
    }
    const chat = await this._chatRoomRepository.getChatRoomByUserId(
      currentUserId,
      opponentUserId,
      currentUserRole
    );

    return chat;
  }
}
