import { injectable } from "tsyringe";
import {
  BookingModel,
  IBookingModel,
} from "../../../frameworks/database/mongoDb/models/booking.model.js";
import { BaseRepository } from "../base.repository.js";
import { IBookingEntity } from "../../../entities/models/booking.entity.js";
import { PipelineStage } from "mongoose";
import { IBookingRepository } from "../../../entities/repositoryInterfaces/booking/booking-repository.interface.js";
import { IBarberDashboardResponse } from "../../../shared/dtos/dashboard-data.dto.js";
import { generateCompleteWeeklyData } from "../../../shared/utils/group-data-by-week.helper.js";

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

  // * Analytics

  async getDashboardAnalytics(
    barberId: string
  ): Promise<Partial<IBarberDashboardResponse["analytics"]>> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookingStats = await BookingModel.aggregate([
      {
        $match: {
          shopId: barberId,
          status: { $in: ["confirmed", "completed"] },
        },
      },
      {
        $facet: {
          totalEarnings: [
            { $match: { status: "completed" } },
            { $group: { _id: null, total: { $sum: "$total" } } },
          ],
          totalBookings: [{ $count: "count" }],
          totalClientsServed: [
            { $match: { status: "completed" } },
            { $group: { _id: "$clientId" } },
            { $count: "count" },
          ],
          upcomingAppointmentsToday: [
            {
              $match: {
                date: { $gte: today, $lt: tomorrow },
                status: "confirmed",
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const stats = bookingStats[0];
    const earnings = stats.totalEarnings[0]?.total || 0;
    const totalBookings = stats.totalBookings[0]?.count || 0;
    const totalClients = stats.totalClientsServed[0]?.count || 0;
    const todayAppointments = stats.upcomingAppointmentsToday[0]?.count || 0;

    return {
      totalEarnings: earnings,
      totalBookings,
      totalClientsServed: totalClients,
      upcomingAppointmentsToday: todayAppointments,
    };
  }

  async getBookingAndEarningsChartData(shopId: string): Promise<{
    weeklyBookings: { date: string; count: number }[];
    monthlyBookings: { date: string; count: number }[];
    weeklyEarnings: { date: string; total: number }[];
    monthlyEarnings: { date: string; total: number }[];
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
  
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();
    
    const firstDayOfMonth = new Date(thisYear, thisMonth, 1);
    const lastDayOfMonth = new Date(thisYear, thisMonth + 1, 0);

    console.log(firstDayOfMonth.getDate(), lastDayOfMonth.getDate())
  
    const [weeklyBookings, monthlyBookings, weeklyEarnings, monthlyEarnings] =
      await Promise.all([
        BookingModel.aggregate([
          {
            $match: {
              shopId,
              date: { $gte: weekAgo, $lte: today },
              status: { $in: ["confirmed", "completed"] },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$date" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
  
        BookingModel.aggregate([
          {
            $match: {
              shopId,
              date: { $gte: firstDayOfMonth, $lte: today },
              status: { $in: ["confirmed", "completed"] },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$date" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
  
        BookingModel.aggregate([
          {
            $match: {
              shopId,
              date: { $gte: weekAgo, $lte: today },
              status: "completed",
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$date" },
              },
              total: { $sum: "$total" },
            },
          },
          { $sort: { _id: 1 } },
        ]),
  
        BookingModel.aggregate([
          {
            $match: {
              shopId,
              date: { $gte: firstDayOfMonth, $lte: today },
              status: "completed",
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$date" },
              },
              total: { $sum: "$total" },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);
      
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyDays = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekAgo);
      date.setDate(weekAgo.getDate() + i);
      weeklyDays.push({
        fullDate: date.toISOString().split('T')[0], 
        dayName: dayNames[date.getDay()]
      });
    }
    
    const transformedWeeklyBookings = weeklyDays.map(day => {
      const matchingBooking = weeklyBookings.find(b => b._id === day.fullDate);
      return {
        date: day.dayName,
        count: matchingBooking ? matchingBooking.count : 0
      };
    });
    
    const transformedWeeklyEarnings = weeklyDays.map(day => {
      const matchingEarning = weeklyEarnings.find(e => e._id === day.fullDate);
      return {
        date: day.dayName,
        total: matchingEarning ? matchingEarning.total : 0
      };
    });
    console.log("Monthly details",monthlyBookings, monthlyEarnings)
  
    const transformedMonthlyBookings = generateCompleteWeeklyData(monthlyBookings);
    const transformedMonthlyEarnings = generateCompleteWeeklyData(monthlyEarnings, true);

  
    return {
      weeklyBookings: transformedWeeklyBookings,
      monthlyBookings: transformedMonthlyBookings,
      weeklyEarnings: transformedWeeklyEarnings,
      monthlyEarnings: transformedMonthlyEarnings,
    };
  }

  async getUpcomingAppointmentsForToday(shopId: string): Promise<IBarberDashboardResponse["upcomingAppointments"]> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
  
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
  
    return BookingModel.aggregate([
      {
        $match: {
          shopId,
          status: "confirmed",
          date: { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "userId",
          as: "client",
        },
      },
      { $unwind: "$client" },
      {
        $project: {
          bookingId: 1,
          timeSlot: "$startTime",
          services: 1,
          status: 1,
          clientName: "$client.fullName",
          clientAvatar: "$client.avatar",
        },
      },
    ]);
  }
  
}
