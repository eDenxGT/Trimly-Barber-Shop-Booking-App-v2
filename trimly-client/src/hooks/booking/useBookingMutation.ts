import { IAxiosResponse } from "@/types/Response";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useBookingCancelMutation = (
	mutationFunc: (bookingId: string) => Promise<IAxiosResponse>
) => {
	const queryClient = useQueryClient();

	return useMutation<IAxiosResponse, Error, string>({
		mutationFn: (bookingId) => mutationFunc(bookingId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["all-booking"] });
		},
	});
};

export const useBookingCompleteMutation = (
	mutationFunc: (bookingId: string) => Promise<IAxiosResponse>
) => {
	const queryClient = useQueryClient();

	return useMutation<IAxiosResponse, Error, string>({
		mutationFn: (bookingId) => mutationFunc(bookingId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["all-booking"] });
		},
	});
};
