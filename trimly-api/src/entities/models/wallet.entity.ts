export interface IWalletEntity {
  ownerId: string;
  walletId: string;
  ownerType: "barber" | "client";
  balance: number;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}
