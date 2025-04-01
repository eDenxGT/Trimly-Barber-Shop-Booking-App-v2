import { IBarberEntity } from "../barber.entity.js";
import { IClientEntity } from "../client.entity.js";

export interface IPaginatedUsers {
	user: IClientEntity[] | IBarberEntity[] | [];
	total: number;
}
