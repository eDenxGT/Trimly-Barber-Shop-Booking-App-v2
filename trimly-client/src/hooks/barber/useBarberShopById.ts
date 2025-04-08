import { useQuery } from "@tanstack/react-query";
import { ForType } from "./useAllBarberShops";
import { IBarberResponse } from "@/types/Response";

export type BarberDetailsQueryFn = (params: {
	shopId: string;
	forType: ForType;
}) => Promise<IBarberResponse>;

export const useBarberShopById = (
	queryFn: BarberDetailsQueryFn,
	shopId: string,
	forType: ForType
) => {
	return useQuery<IBarberResponse, Error>({
		queryKey: ["barber-details", shopId, forType],
		queryFn: () => queryFn({ shopId, forType }),
	});
};
