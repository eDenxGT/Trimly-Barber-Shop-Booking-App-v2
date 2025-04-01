import { injectable } from "tsyringe";
import {
	BarberModel,
	IBarberModel,
} from "../../../frameworks/database/mongoDb/models/barber.model.js";
import { BaseRepository } from "../base.repository.js";

@injectable()
export class BarberRepository extends BaseRepository<IBarberModel> {
	constructor() {
		super(BarberModel);
	}
}
