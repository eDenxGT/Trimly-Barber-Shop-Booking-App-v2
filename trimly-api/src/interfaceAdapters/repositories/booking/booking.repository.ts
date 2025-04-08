import { injectable } from "tsyringe";
import {
	BookingModel,
	IBookingModel,
} from "../../../frameworks/database/mongoDb/models/booking.model.js";
import { BaseRepository } from "../base.repository.js";

@injectable()
export class BookingRepository extends BaseRepository<IBookingModel> {
	constructor() {
		super(BookingModel);
	}
}
