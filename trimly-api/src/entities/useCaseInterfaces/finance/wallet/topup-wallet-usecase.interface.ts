export interface ITopUpWalletUseCase {
  execute(
    userId: string,
    role: "client" | "barber",
    transactionId: string,
    amount: number
  ): Promise<{
    orderId: string;
    amount: number;
    currency: string;
  }>;
}
