import { forgotPassword } from "@/services/auth/authService";
import { IAxiosResponse } from "@/types/Response";
import { useMutation } from "@tanstack/react-query";

export const useForgotPasswordMutation = () => {
	return useMutation<IAxiosResponse, Error, { email: string; role: string }>({
		mutationFn: forgotPassword,
	});
};
