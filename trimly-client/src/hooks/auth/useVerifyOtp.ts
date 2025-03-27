import { verifyOtp } from "@/services/auth/authService";
import { IAxiosResponse } from "@/types/Response";
import { useMutation } from "@tanstack/react-query";

interface Data {
	email: string;
	otp: string;
}

export const useVerifyOTPMutation = () => {
	return useMutation<IAxiosResponse, Error, Data>({
		mutationFn: verifyOtp,
	});
};
