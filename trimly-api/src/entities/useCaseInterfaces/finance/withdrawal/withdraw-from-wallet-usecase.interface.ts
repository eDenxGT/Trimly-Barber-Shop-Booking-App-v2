export interface IWithdrawFromWalletUseCase {
  execute(
    userId: string,
    role: "client" | "barber",
    amount: number,
    method: "upi" | "bank",
    accountDetails: {
      upiId?: string;
      accountHolderName?: string;
      accountNumber?: string;
      ifscCode?: string;
      bankName?: string;
    }
  ): Promise<void>;
}
