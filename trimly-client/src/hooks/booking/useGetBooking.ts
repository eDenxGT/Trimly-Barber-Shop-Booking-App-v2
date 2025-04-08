import { IBookingResponse } from "@/types/Response";
import { useQuery } from "@tanstack/react-query";

export const useGetBooking = (
	queryFunc: (shopId: string) => Promise<IBookingResponse>,
	shopId: string
) => {
	return useQuery<IBookingResponse>({
		queryKey: ["booking", shopId],
		queryFn: () => queryFunc(shopId),
		placeholderData: (prev) => prev ?? undefined,
	});
};
