import { inject, injectable } from "tsyringe";
import { IBookingEntity } from "../../entities/models/booking.entity.js";
import { IGetAllBookingsUseCase } from "../../entities/useCaseInterfaces/booking/get-all-booking-usecase.interface.js";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface.js";

@injectable()
export class GetAllBookingsUseCase implements IGetAllBookingsUseCase {
	constructor(
		@inject("IBookingRepository")
		private _bookingRepository: IBookingRepository
	) {}

	async execute(shopId: string, role: string): Promise<IBookingEntity[]> {
		let filter;
		if (role === "client") {
			filter = { shopId, status: "confirmed" };
		} else {
			filter = { shopId };
		}
		const bookings = await this._bookingRepository.find(filter);
		return bookings;
	}
}
