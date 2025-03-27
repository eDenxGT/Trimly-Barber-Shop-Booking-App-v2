import { IUserEntity } from "./user.entity.js";

export interface IAdminEntity extends IUserEntity {
	isSuperAdmin: boolean;
}
