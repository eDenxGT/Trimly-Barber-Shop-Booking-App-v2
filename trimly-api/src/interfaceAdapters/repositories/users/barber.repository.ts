import { injectable } from "tsyringe";
import {
  BarberModel,
  IBarberModel,
} from "../../../frameworks/database/mongoDb/models/barber.model.js";
import { BaseRepository } from "../base.repository.js";
import { IBarberEntity } from "../../../entities/models/barber.entity.js";
import { IBarberRepository } from "../../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IBookingEntity } from "../../../entities/models/booking.entity.js";
import { IServiceEntity } from "../../../entities/models/service.enity.js";
import { FilterQuery, PipelineStage } from "mongoose";
import { IAdminDashboardResponse } from "../../../shared/dtos/dashboard-data.dto.js";

@injectable()
export class BarberRepository
  extends BaseRepository<IBarberModel>
  implements IBarberRepository
{
  constructor() {
    super(BarberModel);
  }

  async updateRevenue(shopId: string, revenue: number): Promise<void> {
    if (!revenue || isNaN(revenue)) return;

    await BarberModel.updateOne(
      { userId: shopId },
      { $inc: { totalRevenue: revenue, walletBalance: revenue } }
    );
  }

  async findAllNearbyShopsWithFilters(
    filters: {
      search?: string;
      amenities: string[];
      location?: any;
    },
    sorting: {
      sortBy: "averageRating";
      sortOrder: "asc" | "desc";
    },
    pagination: {
      page: number;
      limit: number;
    }
  ): Promise<IBarberEntity[]> {
    const { page, limit } = pagination;
    const { sortBy, sortOrder } = sorting;
    const skip = (page - 1) * limit;
    const pipeline: any[] = [];

    if (filters.location) {
      pipeline.push(filters.location);
    }

    pipeline.push({
      $match: {
        status: "active",
      },
    });

    if (filters.search) {
      pipeline.push({
        $lookup: {
          from: "services",
          localField: "userId",
          foreignField: "barberId",
          as: "services",
        },
      });

      pipeline.push({
        $match: {
          $or: [
            {
              "location.displayName": { $regex: filters.search, $options: "i" },
            },
            { "location.name": { $regex: filters.search, $options: "i" } },
            { shopName: { $regex: filters.search, $options: "i" } },
            { "services.name": { $regex: filters.search, $options: "i" } },
          ],
        },
      });
    } else {
      pipeline.push({
        $lookup: {
          from: "services",
          localField: "userId",
          foreignField: "barberId",
          as: "services",
        },
      });
    }

    const validAmenities = filters.amenities.filter(Boolean);
    if (validAmenities.length > 0) {
      const amenitiesFilter: any = {};
      validAmenities.forEach((amenity) => {
        amenitiesFilter[`amenities.${amenity}`] = true;
      });
      pipeline.push({ $match: amenitiesFilter });
    }

    pipeline.push(
      {
        $lookup: {
          from: "reviews",
          localField: "userId",
          foreignField: "shopId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.rating" },
              else: null,
            },
          },
        },
      },
      {
        $unset: "reviews",
      }
    );

    if (sortBy) {
      pipeline.push({
        $sort: {
          [sortBy]: sortOrder === "asc" ? 1 : -1,
        },
      });
    }

    pipeline.push({ $skip: skip }, { $limit: limit });

    const shops = await BarberModel.aggregate(pipeline);
    return shops;
  }

  async getBarberShopWithAllDetails(filter: any): Promise<
    IBarberEntity & {
      services: IServiceEntity[];
      bookings: IBookingEntity[];
    }
  > {
    const pipeline: PipelineStage[] = [
      { $match: filter },

      {
        $lookup: {
          from: "services",
          let: { barberUserId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$barberId", "$$barberUserId"],
                },
              },
            },
            ...(filter.status === "active"
              ? [
                  {
                    $match: {
                      status: "active",
                    },
                  },
                ]
              : []),
          ],
          as: "services",
        },
      },

      {
        $lookup: {
          from: "reviews",
          let: { shopUserId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$shopId", "$$shopUserId"],
                },
              },
            },
            {
              $lookup: {
                from: "clients",
                localField: "reviewerId",
                foreignField: "userId",
                as: "reviewer",
              },
            },
            { $unwind: "$reviewer" },
            {
              $project: {
                rating: 1,
                reviewText: 1,
                createdAt: 1,
                reviewerId: 1,
                "reviewer.fullName": 1,
                "reviewer.avatar": 1,
              },
            },
          ],
          as: "reviews",
        },
      },

      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
          totalReviewCount: { $size: "$reviews" },
        },
      },
    ];

    if (filter.status === "active") {
      pipeline.push({
        $lookup: {
          from: "bookings",
          let: { shopUserId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$shopId", "$$shopUserId"] },
                    { $eq: ["$status", "confirmed"] },
                  ],
                },
              },
            },
          ],
          as: "bookings",
        },
      });
    } else {
      pipeline.push({
        $lookup: {
          from: "bookings",
          localField: "userId",
          foreignField: "shopId",
          as: "bookings",
        },
      });
    }

    pipeline.push(
      {
        $unwind: {
          path: "$bookings",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "bookings.clientId",
          foreignField: "userId",
          as: "bookings.client",
        },
      },
      {
        $unwind: {
          path: "$bookings.client",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          shopData: { $first: "$$ROOT" },
          bookings: { $push: "$bookings" },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$shopData", { bookings: "$bookings" }],
          },
        },
      }
    );
    const data = await BarberModel.aggregate(pipeline).exec();
    return data[0];
  }

  async findNearest3Shops({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }): Promise<IBarberEntity[]> {
    const pipeline: any[] = [];

    pipeline.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        distanceField: "distance",
        spherical: true,
        query: { status: "active" },
      },
    });

    pipeline.push(
      {
        $lookup: {
          from: "reviews",
          localField: "userId",
          foreignField: "shopId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.rating" },
              else: null,
            },
          },
        },
      },
      {
        $unset: "reviews",
      }
    );

    pipeline.push({
      $sort: {
        averageRating: -1,
      },
    });

    pipeline.push({
      $limit: 3,
    });

    const shops = await BarberModel.aggregate(pipeline);
    return shops;
  }

  async getRecentShops(): Promise<IAdminDashboardResponse["recentShops"]> {
    const recentShops = await BarberModel.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          userId: 1,
          name: "$shopName",
          ownerName: "$ownerName",
          createdAt: 1,
          status: 1,
        },
      },
    ]);

    return recentShops;
  }
}
