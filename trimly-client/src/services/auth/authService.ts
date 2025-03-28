import { authAxiosInstance } from "@/api/auth.axios";
import { ILoginData, UserDTO } from "@/types/User";
import { IAuthResponse, IAxiosResponse } from "@/types/Response";
import { clientAxiosInstance } from "@/api/client.axios";
import { barberAxiosInstance } from "@/api/barber.axios";
import { adminAxiosInstance } from "@/api/admin.axios";

export const signup = async (user: UserDTO): Promise<IAxiosResponse> => {
	const response = await authAxiosInstance.post<IAxiosResponse>(
		"/signup",
		user
	);
	return response.data;
};

export const signin = async (user: ILoginData): Promise<IAuthResponse> => {
	const response = await authAxiosInstance.post<IAuthResponse>(
		"/signin",
		user
	);
	return response.data;
};

export const sendOtp = async (email: string): Promise<IAxiosResponse> => {
	const response = await authAxiosInstance.post<IAxiosResponse>("/send-otp", {
		email,
	});
	return response.data;
};

export const verifyOtp = async (data: {
	email: string;
	otp: string;
}): Promise<IAxiosResponse> => {
	const response = await authAxiosInstance.post<IAxiosResponse>(
		"/verify-otp",
		data
	);
	return response.data;
};

export const logoutClient = async (): Promise<IAxiosResponse> => {
	const response = await clientAxiosInstance.post("/client/logout");
	return response.data;
};

export const logoutBarber = async (): Promise<IAxiosResponse> => {
	const response = await barberAxiosInstance.post("/barber/logout");
	return response.data;
};

export const logoutAdmin = async (): Promise<IAxiosResponse> => {
	const response = await adminAxiosInstance.post("/admin/logout");
	return response.data;
};

export const forgotPassword = async ({
	email,
	role,
}: {
	email: string;
	role: string;
}) => {
	const response = await authAxiosInstance.post<IAxiosResponse>(
		"/forgot-password",
		{
			email,
			role,
		}
	);
	return response.data;
};

export const resetPassword = async ({
	password,
	role,
	token,
}: {
	password: string;
	role: string;
	token: string | undefined;
}) => {
	const response = await authAxiosInstance.post<IAxiosResponse>(
		"/reset-password",
		{
			password,
			role,
			token,
		}
	);
	return response.data;
};

export const googleAuth = async ({
	credential,
	client_id,
	role,
}: {
	credential: string;
	client_id: string;
	role: string;
}): Promise<IAuthResponse> => {
	const response = await authAxiosInstance.post<IAuthResponse>(
		"/google-auth",
		{
			credential,
			client_id,
			role,
		}
	);
	return response.data;
};
