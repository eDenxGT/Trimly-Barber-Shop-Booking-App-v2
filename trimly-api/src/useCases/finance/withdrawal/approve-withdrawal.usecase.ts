import { inject, injectable } from "tsyringe";
import { IApproveWithdrawalUseCase } from "../../../entities/useCaseInterfaces/finance/withdrawal/approve-withdrawal-usecase.interface.js";
import { IWithdrawalRepository } from "../../../entities/repositoryInterfaces/finance/withdrawal-repository.interface.js";
import { ITransactionRepository } from "../../../entities/repositoryInterfaces/finance/transaction-repository.interface.js";

@injectable()
export class ApproveWithdrawalUseCase implements IApproveWithdrawalUseCase {
	constructor(
		@inject("IWithdrawalRepository")
		private _withdrawalRepository: IWithdrawalRepository,
		@inject("ITransactionRepository")
		private _transactionRepository: ITransactionRepository
	) {}
	async execute({ withdrawalId }: { withdrawalId: string }): Promise<void> {
		await this._withdrawalRepository.update(
			{ withdrawalId },
			{ status: "approved", processedAt: new Date() }
		);

		await this._transactionRepository.update(
			{
				source: "withdrawal",
				referenceId: withdrawalId,
			},
			{
				status: "success",
			}
		);
	}
}
