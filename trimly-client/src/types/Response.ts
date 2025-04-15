import { IBooking } from "./Booking";
import { IPost } from "./Feed";
import { IService } from "./Service";
import { IAdmin, IBarber, IClient, UserDTO } from "./User";
import { ITransaction, IWithdrawal } from "./Wallet";

export interface IAxiosResponse {
  success: boolean;
  message: string;
}

export interface IAuthResponse extends IAxiosResponse {
  user: UserDTO;
}

export type IClientResponse = {
  success: boolean;
  message: string;
  user: IClient;
};

export type IBarberResponse = {
  success: boolean;
  message: string;
  user: IBarber;
};

export type IAllBarberShopsResponse = {
  totalPages: number;
  currentPage: number;
  shops: IBarber[];
};

export type IAdminResponse = {
  success: boolean;
  message: string;
  user: IAdmin;
};

export type IServiceResponse = {
  success: boolean;
  message: string;
  services: IService[];
};

export type IBookingResponse = {
  success: boolean;
  message: string;
  bookings: IBooking[];
};

export type IWalletPageResponse = {
  success: boolean;
  balance: number;
  transactions: ITransaction[];
  withdrawals: IWithdrawal[];
};

export interface IBarberHoursResponse extends IAxiosResponse {
  openingHours?: {
    [day: string]: {
      open?: string;
      close?: string;
    } | null;
  };
}

export interface IPostsResponse extends IAxiosResponse {
  items: IPost[];
  total: number;
}

export interface ISinglePostResponse extends IAxiosResponse {
  post: IPost;
}
