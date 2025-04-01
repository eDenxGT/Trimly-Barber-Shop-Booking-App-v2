import { IService } from "./Service";
import { IAdmin, IBarber, IClient, UserDTO } from "./User";

export interface IAxiosResponse {
	success: boolean;
	message: string;
}

export interface IAuthResponse extends IAxiosResponse {
	user: UserDTO;
}

export type IClientResponse = {
	success: boolean;
	message: string;
	user: IClient;
};

export type IBarberResponse = {
	success: boolean;
	message: string;
	user: IBarber;
};

export type IAllBarberShopsResponse = {
	totalPages: number;
	currentPage: number;
	shops: IBarber[];
};

export type IAdminResponse = {
	success: boolean;
	message: string;
	user: IAdmin;
};

export type IServiceResponse = {
	success: boolean;
	message: string;
	services: IService[];
};

export interface IBarberHoursResponse extends IAxiosResponse {
	openingHours?: {
		[day: string]: {
			open?: string;
			close?: string;
		} | null;
	};
}
