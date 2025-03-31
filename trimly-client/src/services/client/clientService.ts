import { clientAxiosInstance } from "@/api/client.axios";
import { ClientResponse } from "@/types/Response";
import { IClient } from "@/types/User";

export type IUpdateClientData = Pick<
	IClient,
	"fullName" | "email" | "phoneNumber" | "avatar" | "location"
>;

// export const updateClientPassword = async ({
// 	oldPassword,
// 	newPassword,
// }: UpdatePasswordData): Promise<IAxiosResponse> => {
// 	const response = await clientAxiosInstance.put<IAxiosResponse>(
// 		"/client/update-password",
// 		{
// 			oldPassword,
// 			newPassword,
// 		}
// 	);
// 	return response.data;
// };

export const updateClientProfile = async (
	data: IUpdateClientData
): Promise<ClientResponse> => {
	const response = await clientAxiosInstance.put<ClientResponse>(
		"/client/details",
		data
	);
	return response.data;
};
