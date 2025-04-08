import { IBookingEntity } from "../../models/booking.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IBookingRepository extends IBaseRepository<IBookingEntity> {}
