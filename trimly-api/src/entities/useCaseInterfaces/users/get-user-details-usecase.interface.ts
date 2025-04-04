import { TRole } from "../../../shared/constants.js";
import { UserDTO } from "../../../shared/dtos/user.dto.js";
import { IAdminEntity } from "../../models/admin.entity.js";
import { IBarberEntity } from "../../models/barber.entity.js";
import { IClientEntity } from "../../models/client.entity.js";

export interface IGetUserDetailsUseCase {
	execute(
		userId: string,
		role: TRole
	): Promise<IBarberEntity | IAdminEntity | IClientEntity>;
}
