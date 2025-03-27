import { googleAuth } from "@/services/auth/authService";
import { useMutation } from "@tanstack/react-query";
import { IAuthResponse } from "@/types/Response";

export const useGoogleMutation = () => {
	return useMutation<
		IAuthResponse,
		Error,
		{ credential: string; client_id: string; role: string }
	>({
		mutationFn: googleAuth,
	});
};
