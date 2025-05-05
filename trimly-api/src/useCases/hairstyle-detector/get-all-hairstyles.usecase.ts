import { inject, injectable } from "tsyringe";
import { IHairstyleRepository } from "../../entities/repositoryInterfaces/hairstyle/hairstyle-repository.interface.js";
import { IHairstyleEntity } from "../../entities/models/hairstyle.entity.js";
import { IGetAllHairstylesUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/get-all-hairstyles-usecase.interface.js";

@injectable()
export class GetAllHairstylesUseCase implements IGetAllHairstylesUseCase {
  constructor(
    @inject("IHairstyleRepository")
    private _hairstyleRepository: IHairstyleRepository
  ) {}

  async execute({
    search,
    page,
    limit,
  }: {
    search: string;
    page: number;
    limit: number;
  }): Promise<{ hairstyles: IHairstyleEntity[]; totalPages: number }> {
    const skip = (page - 1) * limit;
    return await this._hairstyleRepository.searchHairstylesWithPagination({
      search,
      skip,
      limit,
    });
  }
}
