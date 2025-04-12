export interface IWithdrawalEntity {
  withdrawalId: string;
  walletId: string;
  userId: string;
  userType: "client" | "barber";
  amount: number;
  status: "pending" | "approved" | "rejected";
  method: "upi" | "bank";
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  upiId?: string;
  remarks?: string;
  requestedAt?: Date;
  processedAt?: Date;
}
