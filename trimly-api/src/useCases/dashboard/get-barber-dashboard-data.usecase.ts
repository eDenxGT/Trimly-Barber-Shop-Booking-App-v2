import { inject, injectable } from "tsyringe";
import { IGetBarberDashboardDataUseCase } from "../../entities/useCaseInterfaces/dashboard/get-barber-dashboard-data-usecase..interface.js";
import { IBarberDashboardResponse } from "../../shared/dtos/dashboard-data.dto.js";
import { IReviewRepository } from "../../entities/repositoryInterfaces/review/review-repository.interface.js";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface.js";

@injectable()
export class GetBarberDashboardDataUseCase
  implements IGetBarberDashboardDataUseCase
{
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("IReviewRepository") private _reviewRepository: IReviewRepository
  ) {}
  async execute({
    userId,
  }: {
    userId: string;
  }): Promise<IBarberDashboardResponse> {
    const [
      analytics,
      reviewStats,
      bookingAndEarningsChartData,
      upcomingAppointments,
      latestReviews,
    ] = await Promise.all([
      this._bookingRepository.getDashboardAnalytics(userId),
      this._reviewRepository.getReviewStatsByShopId({ shopId: userId }),
      this._bookingRepository.getBookingAndEarningsChartData(userId),
      this._bookingRepository.getUpcomingAppointmentsForToday(userId),
      this._reviewRepository.getLatestReviews(userId),
    ]);

    
    return {
      analytics: {
        totalEarnings: analytics.totalEarnings || 0,
        totalBookings: analytics.totalBookings || 0,
        totalClientsServed: analytics.totalClientsServed || 0,
        upcomingAppointmentsToday: analytics.upcomingAppointmentsToday || 0,
        averageRating: reviewStats.averageRating,
        totalReviews: reviewStats.totalReviews,
      },
      charts: {
        weeklyBookings: bookingAndEarningsChartData.weeklyBookings,
        monthlyBookings: bookingAndEarningsChartData.monthlyBookings,
        weeklyEarnings: bookingAndEarningsChartData.weeklyEarnings,
        monthlyEarnings: bookingAndEarningsChartData.monthlyEarnings,
      },
      upcomingAppointments: upcomingAppointments,
      latestReviews: latestReviews,
    };
  }
}