import { clientAxiosInstance } from "@/api/client.axios";
import { ForType } from "@/hooks/barber/useAllBarberShops";
import { FetchNearestShopsParams } from "@/hooks/client/useNearestBarberShops";
import {
	IAuthResponse,
	IAxiosResponse,
	IBarberResponse,
	IBookingResponse,
	IClientResponse,
} from "@/types/Response";
import { IBarber, IClient, UpdatePasswordData } from "@/types/User";

export type IUpdateClientData = Pick<
	IClient,
	"fullName" | "email" | "phoneNumber" | "avatar" | "location"
>;

export const refreshClientSession = async (): Promise<IAuthResponse> => {
	const response = await clientAxiosInstance.get<IAuthResponse>(
		"/client/refresh-session"
	);
	return response.data;
};

export const updateClientPassword = async ({
	oldPassword,
	newPassword,
}: UpdatePasswordData): Promise<IAxiosResponse> => {
	const response = await clientAxiosInstance.put<IAxiosResponse>(
		"/client/update-password",
		{
			oldPassword,
			newPassword,
		}
	);
	return response.data;
};

export const updateClientProfile = async (
	data: IUpdateClientData
): Promise<IClientResponse> => {
	const response = await clientAxiosInstance.put<IClientResponse>(
		"/client/details",
		data
	);
	return response.data;
};

export const getAllNearestBarberShops = async ({
	search = "",
	amenities = [],
	userLocation = [],
	sortBy = "rating",
	sortOrder = "asc",
	page = 1,
	limit = 9,
}: FetchNearestShopsParams): Promise<IBarber[]> => {
	const response = await clientAxiosInstance.get("/client/barber-shops", {
		params: {
			search,
			amenities: amenities.join(","),
			userLocation,
			sortBy,
			sortOrder,
			page,
			limit,
		},
	});

	return response.data.shops;
};

export const getBarberShopDetailsById = async ({
	shopId,
	forType,
}: {
	shopId: string;
	forType: ForType;
}): Promise<IBarberResponse> => {
	const response = await clientAxiosInstance.get(
		"/client/barber-shop/details",
		{
			params: {
				shopId,
				forType,
			},
		}
	);
	return response.data;
};

export const getBookingsByShopId = async (
	shopId: string
): Promise<IBookingResponse> => {
	const response = await clientAxiosInstance.get("/client/booking", {
		params: { shopId },
	});

	return response.data;
};

export const getBookingsForClient = async (): Promise<IBookingResponse> => {
	const response = await clientAxiosInstance.get("/client/booking", {
		params: { type: "clientId" },
	});

	return response.data;
};

export const bookingCancel = async (
	bookingId: string
): Promise<IAxiosResponse> => {
	const response = await clientAxiosInstance.patch("/client/booking", {
		bookingId,
	});

	return response.data;
};
