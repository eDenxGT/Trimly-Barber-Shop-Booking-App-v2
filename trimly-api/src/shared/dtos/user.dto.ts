import { ITransactionEntity } from "../../entities/models/transaction.entity.js";
import { IWithdrawalEntity } from "../../entities/models/withdrawal.entity.js";
import { TRole } from "../constants.js";

export interface AdminDTO {
  userId?: string;
  fullName?: string;
  email: string;
  password?: string;
  isSuperAdmin?: boolean;
  role: "admin";
}

export interface ClientDTO {
  userId?: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  avatar?: string;
  googleId?: string;
  role: "client";
}

export interface BarberDTO {
  googleId?: string;
  userId?: string;
  shopName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  password?: string;
  role: "barber";
}

export type UserDTO = AdminDTO | ClientDTO | BarberDTO;

export interface LoginUserDTO {
  email: string;
  password?: string;
  role: TRole;
}

export interface IWalletOverviewDTO {
  balance: number;
  transactions: ITransactionEntity[];
  withdrawals: IWithdrawalEntity[];
}
