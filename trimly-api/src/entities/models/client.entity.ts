import { IUserEntity } from "./user.entity.js";

export interface IClientEntity extends IUserEntity {
	googleId?: string;
	location?: {
		name?: string;
		zipCode?: string;
		latitude?: number | null;
		longitude?: number | null;
	};
}
