import { barberAxiosInstance } from "@/api/barber.axios";
import {
	IAxiosResponse,
	IBarberHoursResponse,
	IBarberResponse,
	IServiceResponse,
} from "@/types/Response";
import { IService } from "@/types/Service";
import { IBarber, UpdatePasswordData } from "@/types/User";

export type IUpdateBarberData = Partial<
	Pick<
		IBarber,
		| "shopName"
		| "email"
		| "phoneNumber"
		| "avatar"
		| "description"
		| "banner"
		| "location"
		| "openingHours"
	>
>;

export const updateBarberPassword = async ({
	oldPassword,
	newPassword,
}: UpdatePasswordData) => {
	const response = await barberAxiosInstance.put<IAxiosResponse>(
		"/barber/update-password",
		{
			oldPassword,
			newPassword,
		}
	);
	return response.data;
};

export const updateBarberProfile = async (
	data: IUpdateBarberData
): Promise<IBarberResponse> => {
	const response = await barberAxiosInstance.put<IBarberResponse>(
		"/barber/details",
		data
	);
	return response.data;
};

// * Services Apis
export const updateBarberService = async (
	data: Partial<IService>
): Promise<IAxiosResponse> => {
	const response = await barberAxiosInstance.put<IAxiosResponse>(
		`/barber/services/${data.serviceId}`,
		data
	);
	return response.data;
};

export const deleteBarberService = async (
	serviceId: string
): Promise<IAxiosResponse> => {
	const response = await barberAxiosInstance.delete<IAxiosResponse>(
		`/barber/services/${serviceId}`
	);
	return response.data;
};

export const addBarberService = async (
	data: IService
): Promise<IAxiosResponse> => {
	const response = await barberAxiosInstance.post<IAxiosResponse>(
		"/barber/services",
		data
	);
	return response.data;
};

export const getBarberServices = async (): Promise<IServiceResponse> => {
	const response = await barberAxiosInstance.get<IServiceResponse>(
		"/barber/services"
	);
	return response.data;
};

// * Services OpeningHours
export const updateOpeningHours = async (
	data: IBarber["openingHours"]
): Promise<IBarberHoursResponse> => {
	const response = await barberAxiosInstance.put<IBarberHoursResponse>(
		`/barber/opening-hours`,
		data
	);
	return response.data;
};
// export const getAllActiveShops = async ({
// 	forType = "active",
// 	page = 1,
// 	limit = 10,
// 	search = "",
// }: FetchShopsParams): Promise<ShopsResponse> => {
// 	const response = await barberAxiosInstance.get("/barber/shop", {
// 		params: { forType, page, limit, search },
// 	});
// 	return {
// 		shops: response.data.shops as IBarberShopData[],
// 		totalPages: response.data.totalPages,
// 		currentPage: response.data.currentPage,
// 	};
// };

// export const getShopByIdForBarbers = async (
// 	shopId: string
// ): Promise<BarberShopResponse> => {
// 	const response = await barberAxiosInstance.get(`/barber/shop/${shopId}`);
// 	return response.data;
// };

// export const updateBarberShopFromOwner = async (
// 	data: IBarberShopWithBarbers
// ): Promise<IAxiosResponse> => {
// 	const { shopId } = data;
// 	const response = await barberAxiosInstance.put<IAxiosResponse>(
// 		`/barber/shop/${shopId}`,
// 		data
// 	);
// 	return response.data;
// };
