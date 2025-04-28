import { inject, injectable } from "tsyringe";
import { IBarberJoinCommunityUseCase } from "../../../entities/useCaseInterfaces/chat/community/barber-join-community-usecase.interface.js";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/chat/community/community-respository.interface.js";
import { CustomError } from "../../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";

@injectable()
export class BarberJoinCommunityUseCase implements IBarberJoinCommunityUseCase {
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository
  ) {}

  async execute({
    communityId,
    userId,
  }: {
    communityId: string;
    userId: string;
  }): Promise<void> {
    const community = await this._communityRepository.findOne({
      communityId,
      status: "active",
    });

    if (!community) {
      throw new CustomError(
        ERROR_MESSAGES.COMMUNITY_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (community.members.includes(userId)) {
      throw new CustomError(
        ERROR_MESSAGES.ALREADY_JOINED_IN_COMMUNITY,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this._communityRepository.update({ communityId }, {
        $addToSet:{
            members: userId
        }
    });
  }
}
