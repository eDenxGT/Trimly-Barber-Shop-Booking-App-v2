import { TRole } from "../../../shared/constants.js";
import { IBarberEntity } from "../../models/barber.entity.js";
import { IClientEntity } from "../../models/client.entity.js";
import { IUserEntity } from "../../models/user.entity.js";

export interface IGoogleUseCase {
	execute(
		credential: string,
		client_id: string,
		role: TRole
	): Promise<Partial<IBarberEntity | IClientEntity>>;
}
