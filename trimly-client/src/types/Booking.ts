import { IService } from "./Service";
import { IBarber, IClient } from "./User";

export interface IBooking {
  bookingId?: string;
  shopId: string;
  orderId?: string;
  date: Date;
  startTime: string;
  bookedTimeSlots: string[];
  duration: number;
  total: number;
  clientId: string;
  status?: "pending" | "completed" | "cancelled" | "confirmed";
  createdAt?: Date;
  updatedAt?: Date;
  servicesDetails?: IService[];
  shopDetails?: IBarber | null;
  clientDetails?: IClient | null;
}

export interface IBookingPayload {
  bookedTimeSlots: string[];
  clientId: string;
  date: Date;
  duration: number;
  services: string[];
  shopId: string;
  startTime: string;
  total: number;
}
