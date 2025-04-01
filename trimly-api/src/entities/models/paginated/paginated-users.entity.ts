import { IBarberEntity } from "../barber.entity.js";
import { IClientEntity } from "../client.entity.js";

export interface IPaginatedUsers {
	users: IClientEntity[] | IBarberEntity[] | [];
	total: number;
}
