import { inject, injectable } from "tsyringe";
import { IRejectWithdrawalUseCase } from "../../../entities/useCaseInterfaces/finance/withdrawal/reject-withdrawal-usecase.interface.js";
import { IWithdrawalRepository } from "../../../entities/repositoryInterfaces/finance/withdrawal-repository.interface.js";
import { ITransactionRepository } from "../../../entities/repositoryInterfaces/finance/transaction-repository.interface.js";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/finance/wallet-repository.interface.js";

@injectable()
export class RejectWithdrawalUseCase implements IRejectWithdrawalUseCase {
	constructor(
		@inject("IWithdrawalRepository")
		private _withdrawalRepository: IWithdrawalRepository,
		@inject("ITransactionRepository")
		private _transactionRepository: ITransactionRepository,
		@inject("IWalletRepository")
		private _walletRepository: IWalletRepository
	) {}
	async execute({
		withdrawalId,
		remarks,
	}: {
		withdrawalId: string;
		remarks: string;
	}): Promise<void> {
		const withdrawal = await this._withdrawalRepository.update(
			{ withdrawalId },
			{ status: "rejected", remarks, processedAt: new Date() }
		);

		await this._walletRepository.incrementBalance(
			withdrawal?.userId as string,
			withdrawal?.amount as number
		);

		await this._transactionRepository.update(
			{
				source: "withdrawal",
				referenceId: withdrawalId,
			},
			{
				status: "failed",
			}
		);
	}
}
