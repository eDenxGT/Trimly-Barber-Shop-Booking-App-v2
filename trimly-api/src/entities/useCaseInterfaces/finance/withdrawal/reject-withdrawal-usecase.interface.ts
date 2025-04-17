export interface IRejectWithdrawalUseCase {
	execute({
		withdrawalId,
		remarks,
	}: {
		withdrawalId: string;
		remarks: string;
	}): Promise<void>;
}
