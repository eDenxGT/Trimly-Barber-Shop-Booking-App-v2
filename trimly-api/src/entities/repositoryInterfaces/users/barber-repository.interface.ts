import { IBarberDashboardResponse } from "../../../shared/dtos/dashboard-data.dto.js";
import { IBarberEntity } from "../../models/barber.entity.js";
import { IBookingEntity } from "../../models/booking.entity.js";
import { IServiceEntity } from "../../models/service.enity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IBarberRepository extends IBaseRepository<IBarberEntity> {
  updateRevenue(shopId: string, revenue: number): Promise<void>;
  findAllNearbyShopsWithFilters(
    filters: {
      search?: string;
      amenities: string[];
    },
    sorting: {
      sortBy: string;
      sortOrder: "asc" | "desc";
    },
    pagination: {
      page: number;
      limit: number;
    }
    // userLocation: number[] // [longitude, latitude]
  ): Promise<IBarberEntity[]>;
  getBarberShopWithAllDetails(filter: any): Promise<
    IBarberEntity & {
      services: IServiceEntity[];
      bookings: IBookingEntity[];
    }
  >;

  findNearest3Shops({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }): Promise<IBarberEntity[] | null>;
}
