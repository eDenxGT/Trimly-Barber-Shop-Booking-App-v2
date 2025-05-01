import { inject, injectable } from "tsyringe";
import { IGetAdminDashboardDataUseCase } from "../../entities/useCaseInterfaces/dashboard/get-admin-dashboard-data-usecase.interface.js";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface.js";
import { analytics } from "googleapis/build/src/apis/analytics/index.js";
import { IAdminDashboardResponse } from "../../shared/dtos/dashboard-data.dto.js";

@injectable()
export class GetAdminDashboardDataUseCase
  implements IGetAdminDashboardDataUseCase
{
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("IBarberRepository")
    private _barberRepository: IBarberRepository,
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(): Promise<IAdminDashboardResponse> {
    const [
      totalClients,
      totalBarbers,
      totalBookings,
      totalEarningsResult,
      bookingAndEarningsChartData,
      recentShops,
      recentClients,
    ] = await Promise.all([
      this._clientRepository.countDocuments({}),
      this._barberRepository.countDocuments({}),
      this._bookingRepository.countDocuments({}),
      this._bookingRepository.getTotalEarnings(),
      this._bookingRepository.getBookingAndEarningsChartDataForAdmin(),
      this._barberRepository.getRecentShops(),
      this._clientRepository.getRecentClients(),
    ]);

    return {
      analytics: {
        totalClients,
        totalBarbers,
        totalBookings,
        totalEarnings: totalEarningsResult,
      },

      charts: {
        weeklyBookings: bookingAndEarningsChartData.weeklyBookings,
        monthlyBookings: bookingAndEarningsChartData.monthlyBookings,
        weeklyEarnings: bookingAndEarningsChartData.weeklyEarnings,
        monthlyEarnings: bookingAndEarningsChartData.monthlyEarnings,
      },

      recentShops,
      recentClients,
    };
  }
}
