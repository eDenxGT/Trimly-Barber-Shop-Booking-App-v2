export interface IGetAllUserWithdrawalsUseCase {
	execute(params: {
		page: number;
		limit: number;
		status?: string;
		method?: string;
		search?: string;
		sortField?: string;
		sortDirection?: "asc" | "desc";
	}): Promise<{
		withdrawals: any[];
		total: number;
		page: number;
		limit: number;
	}>;
}
