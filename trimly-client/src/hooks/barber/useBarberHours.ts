import { useMutation } from "@tanstack/react-query";
import { IBarber } from "@/types/User";
import { IBarberHoursResponse } from "@/types/Response";
import { updateOpeningHours } from "@/services/barber/barberService";

export const useBarberHourUpdateMutation = () => {
	return useMutation<IBarberHoursResponse, Error, IBarber["openingHours"]>({
		mutationFn: updateOpeningHours,
	});
};
