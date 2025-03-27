import { UserRoles } from "./UserRoles";

type statusTypes = "active" | "pending" | "blocked";

export interface User {
	id?: string;
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

export interface IAdmin extends User {
	isSuperAdmin?: boolean;
}

export interface IClient extends User {
	location?: {
		name?: string;
		zipCode?: string;
		latitude?: number | null;
		longitude?: number | null;
	};
}

export interface IBarberShop extends User {
	banner?: string;
	description?: string;
	openingHours: {
		[day: string]: {
			open?: string;
			close?: string;
		} | null;
	};
	location?: {
		name?: string;
		zipCode?: string;
		latitude?: number | null;
		longitude?: number | null;
	};
	services?: {
		serviceId: string;
		name: string;
		price: number;
		duration: string;
		genderType: "male" | "female" | "unisex";
		description?: string;
	}[];
}

export type UserDTO = IAdmin | IClient | IBarberShop;
