import { injectable } from "tsyringe";
import {
  IMeetingRoomModel,
  MeetingRoomModel,
} from "../../../frameworks/database/mongoDb/models/chat/meeting-room.model.js";
import { BaseRepository } from "../base.repository.js";
import { IMeetingRoomRepository } from "../../../entities/repositoryInterfaces/chat/meeting-room-repository.interface.js";
import { IMeetingRoomEntity } from "../../../entities/models/chat/meeting-room.entity.js";

@injectable()
export class MeetingRoomRepository
  extends BaseRepository<IMeetingRoomModel>
  implements IMeetingRoomRepository
{
  constructor() {
    super(MeetingRoomModel);
  }

  async findLastPlannedMeeting(
    communityId: string
  ): Promise<IMeetingRoomModel | null> {
    return await MeetingRoomModel.findOne({ communityId }).sort({
      createdAt: -1,
    });
  }

  async getAllMeetingsForListing({
    search,
    status,
    date,
    page,
    limit,
  }: {
    search: string;
    status: string;
    date: string;
    page: number;
    limit: number;
  }): Promise<{ meetings: IMeetingRoomEntity[]; totalPages: number }> {
    const matchConditions: any[] = [];

    if (search) {
      matchConditions.push({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { "communityDetails.name": { $regex: search, $options: "i" } },
        ],
      });
    }

    if (status) {
      matchConditions.push({ status });
    }

    if (date) {
      const dateObj = new Date(date);
      const nextDay = new Date(dateObj);
      nextDay.setDate(dateObj.getDate() + 1);

      matchConditions.push({ startTime: { $gte: dateObj, $lt: nextDay } });
    }

    const basePipeline = [
      {
        $lookup: {
          from: "communities",
          localField: "communityId",
          foreignField: "communityId",
          as: "communityDetails",
        },
      },
      {
        $unwind: {
          path: "$communityDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: matchConditions.length ? { $and: matchConditions } : {},
      },
    ];

    const countResult = await MeetingRoomModel.aggregate([
      ...basePipeline,
      { $count: "total" },
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    const meetings = await MeetingRoomModel.aggregate([
      ...basePipeline,
      {
        $project: {
          meetingId: 1,
          title: 1,
          description: 1,
          communityId: 1,
          startTime: 1,
          endTime: 1,
          meetLink: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          "communityDetails.name": 1,
          "communityDetails.imageUrl": 1,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $sort: { createdAt: -1 } },
    ]);

    return { meetings, totalPages };
  }
}
