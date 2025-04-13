
export interface IUpdateWalletBalanceUseCase {
  execute(
    userId: string,
    role: "client" | "barber",
    transactionId: string
  ): Promise<void>;
}
