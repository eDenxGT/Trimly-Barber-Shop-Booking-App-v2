import { IBarberEntity } from "../barber.entity.js";

export interface IPaginatedShops {
	shops: IBarberEntity[] | [];
	total: number;
}
