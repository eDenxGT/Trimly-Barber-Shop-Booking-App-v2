import { LoginUserDTO } from "../../../shared/dtos/user.dto.js";
import { IAdminEntity } from "../../models/admin.entity.js";
import { IBarberShopEntity } from "../../models/barber-shop.entity.js";
import { IClientEntity } from "../../models/client.entity.js";

export interface ILoginUserUseCase {
	execute(
		user: LoginUserDTO
	): Promise<Partial<IBarberShopEntity | IAdminEntity | IClientEntity>>;
}
