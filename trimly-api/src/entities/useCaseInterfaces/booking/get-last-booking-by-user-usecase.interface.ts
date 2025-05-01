import { IBookingEntity } from "../../models/booking.entity.js";

export interface IGetLastBookingByUserUseCase {
  execute({ userId }: { userId: string }): Promise<IBookingEntity | null>;
}
