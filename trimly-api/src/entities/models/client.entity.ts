import { IUserEntity } from "./user.entity.js";

export interface IClientEntity extends IUserEntity {
	googleId?: string;
	location?: {
		type?: "Point";
		name?: string;
		displayName?: string;
		zipCode?: string;
		coordinates?: number[];
	};
}
