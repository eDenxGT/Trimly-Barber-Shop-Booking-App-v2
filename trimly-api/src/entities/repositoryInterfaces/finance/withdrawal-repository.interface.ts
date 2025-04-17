import { IWithdrawalEntity } from "../../models/withdrawal.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IWithdrawalRepository
	extends IBaseRepository<IWithdrawalEntity> {
	findUserWithdrawals(
		filters: {
			status?: string;
			method?: string;
			search?: string;
		},
		pagination: {
			offset: number;
			limit: number;
		},
		sort: {
			field: string;
			direction: "asc" | "desc";
		}
	): Promise<{ withdrawals: any[]; total: number }>;
}
