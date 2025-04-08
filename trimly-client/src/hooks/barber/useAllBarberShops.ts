import { updateBarberShopStatusById } from "@/services/admin/adminService";
import { IAllBarberShopsResponse, IAxiosResponse } from "@/types/Response";
import { useMutation, useQuery } from "@tanstack/react-query";

export type ForType = "active" | "non-active" | "all" | "pending";

export interface FetchShopsParams {
	forType: ForType;
	page: number;
	limit: number;
	search: string;
}

export const useAllShopsQuery = (
	queryFunc: (params: FetchShopsParams) => Promise<IAllBarberShopsResponse>,
	page: number,
	limit: number,
	search: string,
	forType: ForType
) => {
	return useQuery<IAllBarberShopsResponse>({
		queryKey: ["shops", forType, page, limit, search],
		queryFn: () => queryFunc({ forType, page, limit, search }),
		placeholderData: (prevData) => prevData ?? undefined,
	});
};

export const useUpdateShopStatusMutation = () => {
	return useMutation<
		IAxiosResponse,
		Error,
		{ id: string; status: string; message?: string }
	>({
		mutationFn: updateBarberShopStatusById,
	});
};
