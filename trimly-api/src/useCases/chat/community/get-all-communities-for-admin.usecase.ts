import { inject, injectable } from "tsyringe";
import { ICommunityChatRoomEntity } from "../../../entities/models/chat/community-chat-room.entity.js";
import { IGetAllCommunitiesForAdminUseCase } from "../../../entities/useCaseInterfaces/chat/community/get-all-communities-for-admin-usecase.interface.js";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/chat/community/community-respository.interface.js";

@injectable()
export class GetAllCommunitiesForAdminUseCase
  implements IGetAllCommunitiesForAdminUseCase
{
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository
  ) {}
  async execute({ page, limit }: { page: number; limit: number }): Promise<{
    communities: ICommunityChatRoomEntity[];
    totalPages: number;
    currentPage: number;
  }> {
    const communityData =
      await this._communityRepository.findAllCommunitiesForAdminSide(
        page,
        limit
      );

    return {
      communities: communityData.communities,
      totalPages: communityData.totalPages,
      currentPage: page,
    };
  }
}
