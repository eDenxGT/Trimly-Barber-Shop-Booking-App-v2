import { injectable } from "tsyringe";
import { BaseRepository } from "../../base.repository.js";
import {
  CommunityModel,
  ICommunityChatRoomModel,
} from "../../../../frameworks/database/mongoDb/models/chat/community-chat-room.model.js";
import { ICommunityRepository } from "../../../../entities/repositoryInterfaces/chat/community/community-respository.interface.js";
import { PipelineStage } from "mongoose";
import { ICommunityChatRoomEntity } from "../../../../entities/models/chat/community-chat-room.entity.js";
import { getActiveUsersCount } from "../../../../shared/utils/get-active-users.helper.js";

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
    console.log(userId);
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
  async getAllCommunityChatsByUser({
    userId,
  }: {
    userId: string;
  }): Promise<ICommunityChatRoomEntity[]> {
    const communities = await CommunityModel.aggregate([
      {
        $match: {
          members: userId,
          status: "active",
        },
      },
      {
        $lookup: {
          from: "communitymessages",
          let: { communityId: "$communityId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$communityId", "$$communityId"] },
              },
            },
            { $sort: { timestamp: -1 } },
            { $limit: 1 },
            {
              $lookup: {
                from: "barbers",
                localField: "senderId",
                foreignField: "userId",
                as: "senderDetails",
              },
            },
            {
              $unwind: {
                path: "$senderDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                content: 1,
                mediaUrl: 1,
                messageType: 1,
                timestamp: 1,
                senderDetails: {
                  userId: "$senderDetails.userId",
                  name: "$senderDetails.name",
                  profileImageUrl: "$senderDetails.profileImageUrl",
                  role: { $literal: "barber" },
                },
              },
            },
          ],
          as: "lastMessage",
        },
      },
      {
        $addFields: {
          lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
          membersCount: { $size: "$members" },
        },
      },
      {
        $project: {
          _id: 0,
          communityId: 1,
          name: 1,
          description: 1,
          imageUrl: 1,
          membersCount: 1,
          lastMessage: 1,
        },
      },
    ]);

    console.log(communities);
    return communities.map((community) => ({
      ...community,
      lastMessage: community.lastMessage ?? null,
    }));
  }

  async getCommunityChat({
    userId,
    chatId,
  }: {
    userId: string;
    chatId: string;
  }): Promise<ICommunityChatRoomEntity | null> {
    console.log(userId, chatId);
    const communities = await CommunityModel.aggregate([
      {
        $match: {
          communityId: chatId,
          // members: { $in: [userId] },
          status: "active",
        },
      },
      {
        $lookup: {
          from: "admins",
          localField: "createdBy",
          foreignField: "userId",
          as: "createdByUser",
        },
      },
      { $unwind: "$createdByUser" },
      {
        $lookup: {
          from: "barbers",
          localField: "members",
          foreignField: "userId",
          as: "membersData",
        },
      },
      {
        $lookup: {
          from: "communitymessages",
          let: { communityId: "$communityId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$communityId", "$$communityId"] },
              },
            },
            { $sort: { timestamp: -1 } },
            { $limit: 20 },
            {
              $lookup: {
                from: "barbers",
                localField: "senderId",
                foreignField: "userId",
                as: "sender",
              },
            },
            { $unwind: "$sender" },
            {
              $project: {
                _id: 0,
                messageId: "$messageId",
                communityId: "$communityId",
                messageType: "$messageType",
                content: "$content",
                mediaUrl: "$mediaUrl",
                timestamp: "$timestamp",
                status: "$status",
                readBy: "$readBy",
                senderId: "$sender.userId",
                senderName: "$sender.shopName",
                senderAvatar: "$sender.avatar",
              },
            },
          ],
          as: "messages",
        },
      },
      {
        $project: {
          _id: 0,
          communityId: 1,
          name: 1,
          description: 1,
          imageUrl: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          membersCount: { $size: "$members" },
          members: {
            $map: {
              input: "$membersData",
              as: "member",
              in: {
                userId: "$$member.userId",
                name: "$$member.shopName",
                avatar: "$$member.avatar",
              },
            },
          },
          createdBy: {
            userId: "$createdByUser.userId",
            name: "$createdByUser.shopName",
            avatar: "$createdByUser.avatar",
          },
          messages: 1,
        },
      },
    ]);

    const community = communities.length > 0 ? communities[0] : null;
    if (!community) return null;

    const activeMemberCount = getActiveUsersCount(community.members);

    return {
      ...community,
      activeMembers: activeMemberCount,
    };
  }
}
