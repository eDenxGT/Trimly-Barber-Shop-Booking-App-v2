import { IBookingResponse } from "@/types/Response";
import { useQuery } from "@tanstack/react-query";

export const useGetAllBookingsForClient = () => {
	return useQuery<IBookingResponse>({
		queryKey: ["all-booking"],
		queryFn: () => ,
		placeholderData: (prev) => prev ?? undefined,
	});
};
