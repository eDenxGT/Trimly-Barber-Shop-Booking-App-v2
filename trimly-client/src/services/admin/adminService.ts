import { adminAxiosInstance } from "@/api/admin.axios";
import { FetchUsersParams, UsersResponse } from "@/hooks/admin/useAllUsers";
import { FetchShopsParams } from "@/hooks/barber/useAllBarberShops";
import {
	IAdminResponse,
	IAllBarberShopsResponse,
	IAxiosResponse,
} from "@/types/Response";
import { IAdmin, IBarber, IClient, UpdatePasswordData } from "@/types/User";

export type IUpdateAdminData = Pick<
	IAdmin,
	"fullName" | "email" | "phoneNumber" | "avatar"
>;

export const getAllUsers = async <T extends IClient | IBarber>({
	userType,
	page = 1,
	limit = 10,
	search = "",
}: FetchUsersParams): Promise<UsersResponse<T>> => {
	const response = await adminAxiosInstance.get("/admin/users", {
		params: { userType, page, limit, search },
	});

	return {
		users: response.data.users,
		totalPages: response.data.totalPages,
		currentPage: response.data.currentPage,
	};
};

export const getAllShops = async ({
	forType = "non-active",
	page = 1,
	limit = 10,
	search = "",
}: FetchShopsParams): Promise<IAllBarberShopsResponse> => {
	const response = await adminAxiosInstance.get("/admin/shops", {
		params: { forType, page, limit, search },
	});

	return {
		shops: response.data.shops as IBarber[],
		totalPages: response.data.totalPages,
		currentPage: response.data.currentPage,
	};
};

export const updateBarberShopStatusById = async ({
	id,
	status,
	message,
}: {
	id: string;
	status: string;
	message?: string;
}): Promise<IAxiosResponse> => {
	const response = await adminAxiosInstance.put<IAxiosResponse>(
		`/admin/shop/${id}`,
		{ status, message }
	);
	return response.data;
};

export const updateUserStatus = async (data: {
	userType: string;
	userId: string;
}): Promise<IAxiosResponse> => {
	const response = await adminAxiosInstance.patch(
		"/admin/user-status",
		{},
		{
			params: {
				userType: data.userType,
				userId: data.userId,
			},
		}
	);
	return response.data;
};

export const updateAdminPassword = async ({
	oldPassword,
	newPassword,
}: UpdatePasswordData): Promise<IAxiosResponse> => {
	const response = await adminAxiosInstance.put<IAxiosResponse>(
		"/admin/update-password",
		{
			oldPassword,
			newPassword,
		}
	);
	return response.data;
};

export const updateAdminProfile = async (
	data: IUpdateAdminData
): Promise<IAdminResponse> => {
	const response = await adminAxiosInstance.put<IAdminResponse>(
		"/admin/details",
		data
	);
	return response.data;
};

// export const updateShopStatus = async (
// 	data: Partial<IBarberShopData>
// ): Promise<IAxiosResponse> => {
// 	const response = await adminAxiosInstance.put<IAxiosResponse>(
// 		"/admin/shop",
// 		data
// 	);
// 	return response.data;
// };
