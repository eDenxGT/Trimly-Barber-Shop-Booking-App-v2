import { IBarber } from "@/types/User";
import { useInfiniteQuery } from "@tanstack/react-query";

// export interface SortRule {
// 	sortBy: "rating";
// 	sortOrder: "asc" | "desc";
// }

// export interface FetchNearestShopsParams {
// 	page: number;
// 	limit: number;
// 	search?: string;
// 	sortRules?: SortRule[];
// 	amenities?: string[];
// 	location?: {
// 		latitude: number;
// 		longitude: number;
// 	};
// }

export interface FetchNearestShopsParams {
	search?: string;
	userLocation: number[];
	amenities?: string[];
	sortBy?: string;
	sortOrder?: string;
	page?: number;
	limit?: number;
}

export const useNearestBarberShopsQuery = (
	queryFunc: (params: FetchNearestShopsParams) => Promise<IBarber[]>,
	params: FetchNearestShopsParams
) => {
	return useInfiniteQuery<IBarber[]>({
		queryKey: ["nearest-shops", params],
		queryFn: ({ pageParam = 1 }) =>
			queryFunc({ ...params, page: pageParam as number }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => {
			if (lastPage.length < (params.limit as number)) return undefined;
			return pages.length + 1;
		},
	});
};
