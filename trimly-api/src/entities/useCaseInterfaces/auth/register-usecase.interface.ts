import { UserDTO } from "../../../shared/dtos/user.dto.js";
import { IBarberEntity } from "../../models/barber.entity.js";
import { IClientEntity } from "../../models/client.entity.js";

export interface IRegisterUserUseCase {
	execute(user: UserDTO): Promise<IBarberEntity | IClientEntity | null>;
}
