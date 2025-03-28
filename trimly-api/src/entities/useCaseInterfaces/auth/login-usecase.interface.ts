import { LoginUserDTO } from "../../../shared/dtos/user.dto.js";
import { IAdminEntity } from "../../models/admin.entity.js";
import { IBarberEntity } from "../../models/barber.entity.js";
import { IClientEntity } from "../../models/client.entity.js";

export interface ILoginUserUseCase {
	execute(
		user: LoginUserDTO
	): Promise<Partial<IBarberEntity | IAdminEntity | IClientEntity>>;
}
