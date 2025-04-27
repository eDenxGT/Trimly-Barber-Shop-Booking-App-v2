import { inject, injectable } from "tsyringe";
import { ICommunityChatRoomEntity } from "../../../entities/models/chat/community-chat-room.entity.js";
import { ICreateCommunityUseCase } from "../../../entities/useCaseInterfaces/chat/community/create-community-usecase.interface.js";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/chat/community/community-respository.interface.js";

@injectable()
export class CreateCommunityUseCase implements ICreateCommunityUseCase {
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository
  ) {}

  async execute(data: Partial<ICommunityChatRoomEntity>): Promise<void> {
    await this._communityRepository.save(data);
  }
}
