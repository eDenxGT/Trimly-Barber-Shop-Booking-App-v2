import { IBookingEntity } from "../../models/booking.entity.js";

export interface IGetAllBookingsByShopIdUseCase {
	execute(shopId: string, role: string): Promise<IBookingEntity[]>;
}
