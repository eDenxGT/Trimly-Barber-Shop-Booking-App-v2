import { useMutation } from "@tanstack/react-query";
import { IAxiosResponse } from "./../../types/Response";
import { updateBarberPassword } from "@/services/barber/barberService";
import { UpdatePasswordData } from "@/types/User";

export const useBarberPasswordUpdateMutation = () => {
	return useMutation<IAxiosResponse, Error, UpdatePasswordData>({
		mutationFn: updateBarberPassword,
	});
};
