export interface IWalletEntity {
  ownerId: string;
  ownerType: "barber" | "client";
  balance: number;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}
