import { injectable } from "tsyringe";
import { BaseRepository } from "../../base.repository.js";
import {
  CommunityModel,
  ICommunityChatRoomModel,
} from "../../../../frameworks/database/mongoDb/models/chat/community-chat-room.model.js";
import { ICommunityRepository } from "../../../../entities/repositoryInterfaces/chat/community/community-respository.interface.js";
import { PipelineStage } from "mongoose";
import { ICommunityChatRoomEntity } from "../../../../entities/models/chat/community-chat-room.entity.js";

@injectable()
export class CommunityRepository
  extends BaseRepository<ICommunityChatRoomModel>
  implements ICommunityRepository
{
  constructor() {
    super(CommunityModel);
  }

  async findAllCommunitiesForListing({
    filter,
    userId,
    search,
    page,
    limit,
  }: {
    filter: Partial<ICommunityChatRoomEntity>;
    userId?: string;
    search: string;
    page: number;
    limit: number;
  }) {
    console.log(userId)
    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [];

    if (search.trim()) {
      pipeline.push({
        $match: {
          name: { $regex: search.trim(), $options: "i" },
        },
      });
    }

    if (filter && Object.keys(filter).length > 0) {
      pipeline.push({
        $match: filter,
      });
    }

    pipeline.push({
      $sort: { createdAt: -1 },
    });

    pipeline.push({
      $lookup: {
        from: "admins",
        localField: "createdBy",
        foreignField: "userId",
        as: "adminDetails",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$adminDetails",
        preserveNullAndEmptyArrays: true,
      },
    });

    pipeline.push({
      $addFields: {
        membersCount: { $size: "$members" },
        ...(userId
          ? {
              isJoined: {
                $in: [userId, "$members"],
              },
            }
          : {}),
      },
    });

    pipeline.push({
      $facet: {
        communities: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 0,
              communityId: 1,
              name: 1,
              description: 1,
              imageUrl: 1,
              membersCount: 1,
              isJoined: 1,
              status: 1,
              createdBy: {
                userId: "$createdBy",
                name: "$adminDetails.fullName",
                avatar: "$adminDetails.avatar",
              },
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    });

    pipeline.push({
      $project: {
        communities: 1,
        totalCount: {
          $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
        },
      },
    });

    const result = await CommunityModel.aggregate(pipeline).exec();

    const { communities, totalCount } = result[0] || {
      communities: [],
      totalCount: 0,
    };
    const totalPages = Math.ceil(totalCount / limit);

    return {
      communities,
      totalPages,
      currentPage: page,
    };
  }
}
