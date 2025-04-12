export interface IWithdrawalEntity {
  walletId: string;
  userId: string;
  userType: "client" | "barber";
  amount: number;
  status: "pending" | "approved" | "rejected";
  method: "upi" | "bank_transfer";
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  upiId?: string;
  remarks?: string;
  requestedAt?: Date;
  processedAt?: Date;
}
