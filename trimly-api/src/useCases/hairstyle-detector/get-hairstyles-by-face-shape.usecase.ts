import { IHairstyleEntity } from "../../entities/models/hairstyle.entity.js";
import { IGetHairstylesByFaceShapeUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/get-hairstyles-by-face-shape-usecase.interface.js";
import { injectable, inject } from "tsyringe";
import { IHairstyleRepository } from "../../entities/repositoryInterfaces/hairstyle/hairstyle-repository.interface.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";

@injectable()
export class GetHairstylesByFaceShapeUseCase
  implements IGetHairstylesByFaceShapeUseCase
{
  constructor(
    @inject("IHairstyleRepository")
    private _hairstyleRepository: IHairstyleRepository
  ) {}

  async execute({
    faceShape,
    gender,
  }: {
    faceShape: string;
    gender: string;
  }): Promise<IHairstyleEntity[]> {
    const normalizedFaceShape = faceShape.toLowerCase();

    const hairstyles = await this._hairstyleRepository.find({
      faceShapes: { $in: [normalizedFaceShape] },
      gender,
    });

    if (!hairstyles.length) {
      throw new CustomError(
        ERROR_MESSAGES.HAIRSTYLE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return hairstyles;
  }
}
