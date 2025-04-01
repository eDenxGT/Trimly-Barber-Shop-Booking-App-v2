import { IBarber, IClient } from "@/types/User";
import { useQuery } from "@tanstack/react-query";

export type UserType = "client" | "barber";

export interface FetchUsersParams {
	userType: UserType;
	page: number;
	limit: number;
	search: string;
}

export type UsersResponse<T> = {
	users: T[];
	totalPages: number;
	currentPage: number;
};

export const useAllUsersQuery = <T extends IClient | IBarber>(
	queryFunc: (params: FetchUsersParams) => Promise<UsersResponse<T>>,
	page: number,
	limit: number,
	search: string,
	userType: UserType
) => {
	return useQuery({
		queryKey: ["users", userType, page, limit, search],
		queryFn: () => queryFunc({ userType, page, limit, search }),
		placeholderData: (prevData) => prevData as UsersResponse<T>,
	});
};
