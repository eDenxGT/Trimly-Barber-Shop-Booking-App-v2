import { IBarberDashboardResponse } from "../../../shared/dtos/dashboard-data.dto.js";
import { IBookingEntity } from "../../models/booking.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IBookingRepository extends IBaseRepository<IBookingEntity> {
  findBookingsWithDetailsForClient(userId: string): Promise<IBookingEntity[]>;

  findBookingsWithDetailsForBarber(userId: string): Promise<IBookingEntity[]>;

  findLastBookingByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<IBookingEntity | null>;

  getDashboardAnalytics(
    barberId: string
  ): Promise<Partial<IBarberDashboardResponse["analytics"]>>;

  getBookingAndEarningsChartData(shopId: string): Promise<{
    weeklyBookings: { date: string; count: number }[];
    monthlyBookings: { date: string; count: number }[];
    weeklyEarnings: { date: string; total: number }[];
    monthlyEarnings: { date: string; total: number }[];
  }>;

  getUpcomingAppointmentsForToday(
    shopId: string
  ): Promise<IBarberDashboardResponse["upcomingAppointments"]>;

  getTotalEarnings(): Promise<number>;

  getBookingAndEarningsChartDataForAdmin(): Promise<{
    weeklyBookings: { date: string; count: number }[];
    monthlyBookings: { date: string; count: number }[];
    weeklyEarnings: { date: string; total: number }[];
    monthlyEarnings: { date: string; total: number }[];
  }>;
}
