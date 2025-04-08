import { IService } from "./Service";
import { UserRoles } from "./UserRoles";

type statusTypes = "active" | "pending" | "blocked";

export interface User {
	userId?: string;
	fullName: string;
	email: string;
	role?: UserRoles;
	avatar?: string;
	phoneNumber: string;
	status?: statusTypes;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ILoginData {
	email: string;
	password: string;
	role: UserRoles;
}

export interface UpdatePasswordData {
	oldPassword: string;
	newPassword: string;
}

export interface IAdmin extends User {
	isSuperAdmin?: boolean;
}

export interface IClient extends User {
	googleId?: string;
	location?: {
		name?: string;
		displayName?: string;
		zipCode?: string;
		coordinates?: number[];
	};
}

export interface IBarber extends Omit<User, "fullName"> {
	shopName?: string;
	banner?: string;
	description?: string;
	googleId?: string;
	distance?: number;
	openingHours?: {
		[day: string]: {
			open?: string | null;
			close?: string | null;
		} | null;
	};
	amenities?: {
		wifi: boolean;
		parking: boolean;
	};
	rejectionReason?: string;
	location?: {
		type?: "Point";
		name?: string;
		displayName?: string;
		zipCode?: string;
		coordinates?: number[];
	};
	services?: IService[];
}

export type UserDTO = IAdmin | IClient | IBarber;
