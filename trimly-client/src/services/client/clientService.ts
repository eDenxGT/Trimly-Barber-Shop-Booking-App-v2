import { clientAxiosInstance } from "@/api/client.axios";
import { IAuthResponse, IAxiosResponse, IClientResponse } from "@/types/Response";
import { IClient, UpdatePasswordData } from "@/types/User";

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
