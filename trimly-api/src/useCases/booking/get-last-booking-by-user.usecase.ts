import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface.js";
import { IBookingEntity } from "../../entities/models/booking.entity.js";
import { IGetLastBookingByUserUseCase } from "../../entities/useCaseInterfaces/booking/get-last-booking-by-user-usecase.interface.js";

@injectable()
export class GetLastBookingByUserUseCase
  implements IGetLastBookingByUserUseCase
{
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
  ) {}

  async execute({ userId }: { userId: string }): Promise<IBookingEntity | null> {
    return await this._bookingRepository.findLastBookingByUserId({
      userId,
    });
  }
}
