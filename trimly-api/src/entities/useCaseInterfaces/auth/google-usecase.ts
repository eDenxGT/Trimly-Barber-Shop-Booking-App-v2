import { TRole } from "../../../shared/constants.js";
import { IUserEntity } from "../../models/user.entity.js";

export interface IGoogleUseCase {
	execute(
		credential: string,
		client_id: string,
		role: TRole
	): Promise<Partial<IUserEntity>>;
}
