import { barberAxiosInstance } from "@/api/barber.axios";
import { IAxiosResponse, IBarberResponse } from "@/types/Response";
import { IBarber } from "@/types/User";

export type IUpdateBarberData = Pick<
	IBarber,
	| "shopName"
	| "email"
	| "phoneNumber"
	| "avatar"
	| "description"
	| "banner"
	| "location"
>;

// export const updateBarberPassword = async ({
// 	oldPassword,
// 	newPassword,
// }: UpdatePasswordData) => {
// 	const response = await barberAxiosInstance.put<IAxiosResponse>(
// 		"/barber/update-password",
// 		{
// 			oldPassword,
// 			newPassword,
// 		}
// 	);
// 	return response.data;
// };

export const updateBarberProfile = async (
	data: IUpdateBarberData
): Promise<IBarberResponse> => {
	const response = await barberAxiosInstance.put<IBarberResponse>(
		"/barber/details",
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
