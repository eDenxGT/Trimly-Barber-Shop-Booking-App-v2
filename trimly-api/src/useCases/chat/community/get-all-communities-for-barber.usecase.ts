import { inject, injectable } from "tsyringe";
import { ICommunityChatRoomEntity } from "../../../entities/models/chat/community-chat-room.entity.js";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/chat/community/community-respository.interface.js";
import { IGetAllCommunitiesForBarberUseCase } from "../../../entities/useCaseInterfaces/chat/community/get-all-communities-for-barber-usecase.interface.js";

@injectable()
export class GetAllCommunitiesForBarberUseCase
  implements IGetAllCommunitiesForBarberUseCase
{
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository
  ) {}
  async execute({
    userId,
    search,
    page,
    limit,
  }: {
    userId: string;
    search: string;
    page: number;
    limit: number;
  }): Promise<{
    communities: ICommunityChatRoomEntity[];
    totalPages: number;
    currentPage: number;
  }> {
    const communityData =
      await this._communityRepository.findAllCommunitiesForListing({
        filter: { status: "active" },
        userId,
        search,
        page,
        limit,
      });

    return {
      communities: communityData.communities,
      totalPages: communityData.totalPages,
      currentPage: page,
    };
  }
}
