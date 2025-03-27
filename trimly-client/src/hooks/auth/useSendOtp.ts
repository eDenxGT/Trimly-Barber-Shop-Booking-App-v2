import { sendOtp } from "@/services/auth/authService";
import { IAxiosResponse } from "@/types/Response";
import { useMutation } from "@tanstack/react-query";

export const useSendOTPMutation = () => {
	return useMutation<IAxiosResponse, Error, string>({
		mutationFn: sendOtp,
	});
};
