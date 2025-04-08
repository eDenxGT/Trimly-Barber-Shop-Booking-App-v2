import { IBookingResponse } from "@/types/Response";
import { useQuery } from "@tanstack/react-query";

export const useGetAllBookingsByUser = (
	queryFunc: () => Promise<IBookingResponse>
) => {
	return useQuery<IBookingResponse>({
		queryKey: ["all-booking"],
		queryFn: () => queryFunc(),
		placeholderData: (prev) => prev ?? undefined,
	});
};
