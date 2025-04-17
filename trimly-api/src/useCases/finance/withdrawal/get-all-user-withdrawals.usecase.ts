import { inject, injectable } from "tsyringe";
import { IWithdrawalRepository } from "../../../entities/repositoryInterfaces/finance/withdrawal-repository.interface.js";
import { IGetAllUserWithdrawalsUseCase } from "../../../entities/useCaseInterfaces/finance/withdrawal/get-all-user-withdrawals-usecase.interface.js";

@injectable()
export class GetAllUserWithdrawalsUseCase
	implements IGetAllUserWithdrawalsUseCase
{
	constructor(
		@inject("IWithdrawalRepository")
		private _withdrawalRepository: IWithdrawalRepository
	) {}

	async execute({
		page,
		limit,
		status,
		method,
		search,
		sortField,
		sortDirection,
	}: {
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
	}> {
		const filters = {
			status,
			method,
			search,
		};

		const sorting = {
			field: sortField || "createdAt",
			direction: sortDirection || "desc",
		};

		const offset = (page - 1) * limit;

		const { withdrawals, total } =
			await this._withdrawalRepository.findUserWithdrawals(
				filters,
				{ offset, limit },
				sorting
			);

		return {
			withdrawals,
			total,
			page,
			limit,
		};
	}
}
