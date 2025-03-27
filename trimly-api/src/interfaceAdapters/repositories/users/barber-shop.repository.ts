import {
	BarberShopModel,
	IBarberShopModel,
} from "../../../frameworks/database/mongoDb/models/barber-shop.model.js";
import { BaseRepository } from "../base.repository.js";

export class BarberShopRepository extends BaseRepository<IBarberShopModel> {
	constructor() {
		super(BarberShopModel);
	}
}
