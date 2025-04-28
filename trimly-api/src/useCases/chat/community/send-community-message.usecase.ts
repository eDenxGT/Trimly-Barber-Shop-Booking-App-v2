import { inject, injectable } from "tsyringe";
import { ISendCommunityMessageUseCase } from "../../../entities/useCaseInterfaces/chat/community/send-community-message-usecase.interface.js";
import { ICommunityMessageEntity } from "../../../entities/models/chat/community-message.entity.js";
import { ICommunityMessageRepository } from "../../../entities/repositoryInterfaces/chat/community/community-message-respository.interface.js";
import { IBarberRepository } from "../../../entities/repositoryInterfaces/users/barber-repository.interface.js";

@injectable()
export class SendCommunityMessageUseCase
  implements ISendCommunityMessageUseCase
{
  constructor(
    @inject("ICommunityMessageRepository")
    private _communityMessageRepository: ICommunityMessageRepository,
    @inject("IBarberRepository") private _barberRepository: IBarberRepository
  ) {}

  async execute(
    data: Partial<ICommunityMessageEntity>
  ): Promise<ICommunityMessageEntity> {
    const community =
      await this._communityMessageRepository.saveCommunityMessage(data);

    const barberDetails = await this._barberRepository.findOne({
      userId: data.senderId,
    });

    return {
      ...community,
      senderAvatar: barberDetails?.avatar,
      senderName: barberDetails?.shopName,
    };
  }
}
