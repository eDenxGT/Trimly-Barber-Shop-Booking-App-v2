import { IBooking } from "./Booking";
import {
  ICommunityChat,
  ICommunityChatPreview,
  IDirectChat,
  IDirectChatPreview,
  IMeetingRoom,
} from "./Chat";
import {
  AppointmentData,
  ClientDashboardData,
  IAdminAnalyticsData,
  IAnalyticsData,
  IBookingsChartData,
  IEarningsChartData,
  ReviewData,
  ShopDashboardData,
} from "./DashboardListingTypes";
import { IPost } from "./Feed";
import { IHairstyle } from "./Hairstyle";
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

export interface WithdrawalResponse {
  withdrawals: IWithdrawal[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface IChatResponse extends IAxiosResponse {
  chat: IDirectChat | ICommunityChat;
  success: boolean;
}

export interface IAllChatResponse extends IAxiosResponse {
  chats: IDirectChatPreview[] | ICommunityChatPreview[];
  success: boolean;
}

export interface IAllCommunitiesResponse {
  communities: ICommunityChat[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface ICommunityChatResponse extends IAxiosResponse {
  community: ICommunityChat;
}

// * Meetings
export interface IMeetingRoomResponse extends IAxiosResponse {
  meeting: IMeetingRoom;
}

export interface IAllMeetingRoomResponse extends IAxiosResponse {
  meetings: IMeetingRoom[];
  totalPages: number;
  currentPage: number;
}

// * Home
export interface IClientHomePageResponse extends IAxiosResponse {
  lastBooking: IBooking;
  shops: IBarber[];
}

export interface IBarberDashboardResponse {
  analytics: IAnalyticsData;

  charts: {
    weeklyBookings: IBookingsChartData[];
    monthlyBookings: IBookingsChartData[];
    weeklyEarnings: IEarningsChartData[];
    monthlyEarnings: IEarningsChartData[];
  };

  upcomingAppointments: AppointmentData[];

  latestReviews: ReviewData[];
}

export interface IAdminDashboardResponse {
  analytics: IAdminAnalyticsData;
  charts: {
    weeklyBookings: IBookingsChartData[];
    monthlyBookings: IBookingsChartData[];
    weeklyEarnings: IEarningsChartData[];
    monthlyEarnings: IEarningsChartData[];
  };

  recentShops: ShopDashboardData[];
  recentClients: ClientDashboardData[];
}

export interface IFaceShapeDetectionResponse extends IAxiosResponse {
  faceShape: string;
}

export interface IHairstyleResponse extends IAxiosResponse {
  hairstyles: IHairstyle[];
  
}
export interface IHairstylePaginationResponse extends IAxiosResponse {
  hairstyles: IHairstyle[];
  totalPages: number;
  currentPage: number;
}