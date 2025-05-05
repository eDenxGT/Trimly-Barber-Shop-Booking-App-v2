import { inject, injectable } from "tsyringe";
import { IAddHairstyleUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/add-hairstyle-usecase.interface.js";
import { IHairstyleRepository } from "../../entities/repositoryInterfaces/hairstyle/hairstyle-repository.interface.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";

@injectable()
export class AddHairstyleUseCase implements IAddHairstyleUseCase {
  constructor(
    @inject("IHairstyleRepository")
    private _hairstyleRepository: IHairstyleRepository
  ) {}

  async execute({
    faceShapes,
    gender,
    name,
    image,
  }: {
    faceShapes: string[];
    gender: string;
    name: string;
    image: string;
  }): Promise<void> {
    const hairstyle = await this._hairstyleRepository.findOne({
      name,
    });
    
    if (hairstyle) {
      throw new CustomError(
        ERROR_MESSAGES.HAIRSTYLE_ALREADY_EXISTS,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    
    await this._hairstyleRepository.save({
      hairstyleId: generateUniqueId("hairstyle"),
      faceShapes,
      gender: gender as "male" | "female",
      name,
      image,
    });
  }
}
