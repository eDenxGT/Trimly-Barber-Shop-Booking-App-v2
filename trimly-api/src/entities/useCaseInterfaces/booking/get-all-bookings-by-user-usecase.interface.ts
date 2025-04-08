import { IBookingEntity } from "../../models/booking.entity.js";

export interface IGetAllBookingsByUserUseCase {
	execute(userId: string, role: string): Promise<IBookingEntity[]>;
}
