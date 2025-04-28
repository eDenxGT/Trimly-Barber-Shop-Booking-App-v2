import { inject, injectable } from "tsyringe";
import { ICommunityChatRoomEntity } from "../../../entities/models/chat/community-chat-room.entity.js";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/chat/community/community-respository.interface.js";
import { IGetAllCommunityChatsByUserUseCase } from "../../../entities/useCaseInterfaces/chat/community/get-all-community-chats-by-user-usecase.interface.js";

@injectable()
export class GetAllCommunityChatsByUserUseCase
  implements IGetAllCommunityChatsByUserUseCase
{
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository
  ) {}
  async execute({
    userId,
  }: {
    userId: string;
  }): Promise<Partial<ICommunityChatRoomEntity>[]> {
    const communityChats =
      await this._communityRepository.getAllCommunityChatsByUser({ userId });
    return communityChats;
  }
}
