import { inject, injectable } from "tsyringe";
import { IHairstyleRepository } from "../../entities/repositoryInterfaces/hairstyle/hairstyle-repository.interface.js";
import { IUpdateHairstyleUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/update-hairstyle-usecase.interface.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";

@injectable()
export class UpdateHairstyleUseCase implements IUpdateHairstyleUseCase {
  constructor(
    @inject("IHairstyleRepository")
    private _hairstyleRepository: IHairstyleRepository
  ) {}

  async execute({
    hairstyleId,
    faceShapes,
    gender,
    name,
    image,
  }: {
    hairstyleId: string;
    faceShapes: string[];
    gender: string;
    name: string;
    image: string;
  }): Promise<void> {
    const hairstyle = await this._hairstyleRepository.findOne({
      hairstyleId,
    });

    if (!hairstyle) {
      throw new CustomError(
        ERROR_MESSAGES.HAIRSTYLE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    await this._hairstyleRepository.update(
      { hairstyleId },
      {
        faceShapes,
        gender,
        name,
        image,
      }
    );
  }
}
