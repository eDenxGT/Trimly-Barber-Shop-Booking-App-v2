import {
	IUpdateBarberData,
	updateBarberProfile,
} from "@/services/barber/barberService";
import { IAuthResponse } from "@/types/Response";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useBarberProfileMutation = () => {
	const queryClient = useQueryClient();
	return useMutation<IAuthResponse, Error, IUpdateBarberData>({
		mutationFn: updateBarberProfile,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["barber-profile"] }),
	});
};
