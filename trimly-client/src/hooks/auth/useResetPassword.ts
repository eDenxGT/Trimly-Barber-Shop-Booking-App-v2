import { resetPassword } from "@/services/auth/authService";
import { IAxiosResponse } from "@/types/Response";
import { useMutation } from "@tanstack/react-query";

export const useResetPasswordMutation = () => {
	return useMutation<
		IAxiosResponse,
		Error,
		{ password: string; role: string; token: string | undefined }
	>({
		mutationFn: resetPassword,
	});
};
