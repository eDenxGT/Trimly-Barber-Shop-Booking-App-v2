export interface ITransactionEntity {
  transactionId: string;
  walletId: string;
  type: "credit" | "debit";
  source: "booking" | "topup" | "withdrawal" | "refund";
  amount: number;
  status: "pending" | "success" | "failed";
  referenceId: string;
  createdAt: Date;
}
