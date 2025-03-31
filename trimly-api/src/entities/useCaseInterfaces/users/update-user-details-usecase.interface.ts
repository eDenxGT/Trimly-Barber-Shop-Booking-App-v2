import { IAdminEntity } from "../../models/admin.entity.js";
import { IBarberEntity } from "../../models/barber.entity.js";
import { IClientEntity } from "../../models/client.entity.js";

export interface IUpdateUserDetailsUseCase {
	execute(
		userId: string,
		role: string,
		userDetails: Record<string, any>
	): Promise<IAdminEntity | IClientEntity | IBarberEntity | null>;
}
