import { injectable } from "tsyringe";
import { BaseRepository } from "../../base.repository.js";
import {
  CommunityModel,
  ICommunityChatRoomModel,
} from "../../../../frameworks/database/mongoDb/models/chat/community-chat-room.model.js";
import { ICommunityRepository } from "../../../../entities/repositoryInterfaces/chat/community/community-respository.interface.js";
import { PipelineStage } from "mongoose";

@injectable()
export class CommunityRepository
  extends BaseRepository<ICommunityChatRoomModel>
  implements ICommunityRepository
{
  constructor() {
    super(CommunityModel);
  }

  async findAllCommunitiesForAdminSide(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "admins",
          localField: "createdBy",
          foreignField: "userId",
          as: "adminDetails",
        },
      },
      {
        $unwind: {
          path: "$adminDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          membersCount: { $size: "$members" },
        },
      },
      {
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
                members: 1,
                membersCount: 1,
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
      },
      {
        $project: {
          communities: 1,
          totalCount: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
          },
        },
      },
    ];

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
