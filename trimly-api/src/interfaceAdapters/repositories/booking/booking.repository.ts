import { injectable } from "tsyringe";
import {
  BookingModel,
  IBookingModel,
} from "../../../frameworks/database/mongoDb/models/booking.model.js";
import { BaseRepository } from "../base.repository.js";
import { IBookingEntity } from "../../../entities/models/booking.entity.js";
import { PipelineStage } from "mongoose";
import { IBookingRepository } from "../../../entities/repositoryInterfaces/booking/booking-repository.interface.js";

@injectable()
export class BookingRepository
  extends BaseRepository<IBookingModel>
  implements IBookingRepository
{
  constructor() {
    super(BookingModel);
  }
  async findBookingsWithDetailsForBarber(
    userId: string
  ): Promise<IBookingEntity[]> {
    const pipeline: PipelineStage[] = [
      {
        $match: { shopId: userId },
      },
      {
        $lookup: {
          from: "services",
          localField: "services",
          foreignField: "serviceId",
          as: "servicesDetails",
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "userId",
          as: "clientDetails",
        },
      },
      {
        $unwind: {
          path: "$clientDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          // date: -1,
          // startTime: -1,
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 0,
          bookingId: 1,
          date: 1,
          startTime: 1,
          status: 1,
          duration: 1,
          total: 1,
          servicesDetails: {
            $map: {
              input: "$servicesDetails",
              as: "service",
              in: {
                serviceId: "$$service.serviceId",
                name: "$$service.name",
                price: "$$service.price",
              },
            },
          },
          clientDetails: {
            fullName: "$clientDetails.fullName",
            userId: "$clientDetails.userId",
            avatar: "$clientDetails.avatar",
            phoneNumber: "$clientDetails.phoneNumber",
          },
        },
      },
    ];

    return BookingModel.aggregate(pipeline).exec();
  }

  async findBookingsWithDetailsForClient(
    userId: string
  ): Promise<IBookingEntity[]> {
    const pipeline: PipelineStage[] = [
      {
        $match: { clientId: userId },
      },
      {
        $lookup: {
          from: "services",
          localField: "services",
          foreignField: "serviceId",
          as: "servicesDetails",
        },
      },
      {
        $lookup: {
          from: "barbers",
          localField: "shopId",
          foreignField: "userId",
          as: "shopDetails",
        },
      },
      {
        $unwind: {
          path: "$shopDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          // date: -1,
          // startTime: -1,
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 0,
          bookingId: 1,
          date: 1,
          startTime: 1,
          status: 1,
          total: 1,
          servicesDetails: {
            $map: {
              input: "$servicesDetails",
              as: "service",
              in: {
                name: "$$service.name",
                price: "$$service.price",
              },
            },
          },
          shopDetails: {
            userId: "$shopDetails.userId",
            shopName: "$shopDetails.shopName",
            avatar: "$shopDetails.avatar",
            location: "$shopDetails.location",
          },
        },
      },
    ];

    return BookingModel.aggregate(pipeline).exec();
  }

  async findLastBookingByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<IBookingEntity | null> {
    const pipeline: PipelineStage[] = [
      {
        $match: { clientId: userId },
      },
      {
        $lookup: {
          from: "services",
          localField: "services",
          foreignField: "serviceId",
          as: "servicesDetails",
        },
      },
      {
        $lookup: {
          from: "barbers",
          localField: "shopId",
          foreignField: "userId",
          as: "shopDetails",
        },
      },
      {
        $unwind: {
          path: "$shopDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 1, 
      },
      {
        $project: {
          _id: 0,
          bookingId: 1,
          date: 1,
          startTime: 1,
          status: 1,
          total: 1,
          servicesDetails: {
            $map: {
              input: "$servicesDetails",
              as: "service",
              in: {
                name: "$$service.name",
                price: "$$service.price",
              },
            },
          },
          shopDetails: {
            userId: "$shopDetails.userId",
            shopName: "$shopDetails.shopName",
            avatar: "$shopDetails.avatar",
            location: "$shopDetails.location",
          },
        },
      },
    ];

    const result = await BookingModel.aggregate(pipeline).exec();
    return result[0] || null;
  }
}
