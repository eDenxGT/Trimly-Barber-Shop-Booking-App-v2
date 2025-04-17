export interface IApproveWithdrawalUseCase {
	execute({ withdrawalId }: { withdrawalId: string }): Promise<void>;
}
