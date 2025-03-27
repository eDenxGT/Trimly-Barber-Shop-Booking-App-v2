import { UserDTO } from "../../../shared/dtos/user.dto.js";
import { IBarberShopEntity } from "../../models/barber-shop.entity.js";
import { IClientEntity } from "../../models/client.entity.js";

export interface IRegisterUserUseCase {
	execute(user: UserDTO): Promise<IBarberShopEntity | IClientEntity | null>;
}
