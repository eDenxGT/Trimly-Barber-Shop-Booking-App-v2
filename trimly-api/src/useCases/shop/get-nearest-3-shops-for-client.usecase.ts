import { inject, injectable } from "tsyringe";
import { IBarberEntity } from "../../entities/models/barber.entity.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IGetNearest3ShopsForClientUseCase } from "../../entities/useCaseInterfaces/shop/get-nearest-3-shops-for-client-usecase.interface.js";

@injectable()
export class GetNearest3ShopsForClientUseCase
  implements IGetNearest3ShopsForClientUseCase
{
  constructor(
    @inject("IBarberRepository")
    private _barberRepository: IBarberRepository
  ) {}

  async execute({
    userId,
    latitude,
    longitude,
  }: {
    userId: string;
    latitude: number;
    longitude: number;
  }): Promise<IBarberEntity[] | null> {
    if (!latitude || !longitude) {
      return null;
    }

    return await this._barberRepository.findNearest3Shops({
      latitude,
      longitude,
    });
  }
}
