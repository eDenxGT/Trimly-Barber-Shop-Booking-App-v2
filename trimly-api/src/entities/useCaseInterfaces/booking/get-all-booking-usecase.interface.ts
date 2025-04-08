import { IBookingEntity } from "../../models/booking.entity.js";

export interface IGetAllBookingsUseCase {
	execute(shopId: string, role: string): Promise<IBookingEntity[]>;
}
