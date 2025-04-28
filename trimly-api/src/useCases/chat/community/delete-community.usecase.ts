import { inject, injectable } from "tsyringe";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/chat/community/community-respository.interface.js";
import { IDeleteCommunityUseCase } from "../../../entities/useCaseInterfaces/chat/community/delete-community-usecase.interface.js";

@injectable()
export class DeleteCommunityUseCase implements IDeleteCommunityUseCase {
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository
  ) {}
  async execute(communityId: string): Promise<void> {
    await this._communityRepository.delete({ communityId });
  }
}
