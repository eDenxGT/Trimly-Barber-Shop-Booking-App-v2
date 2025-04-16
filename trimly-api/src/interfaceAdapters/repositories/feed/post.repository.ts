import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository.js";
import { IPostRepository } from "../../../entities/repositoryInterfaces/feed/post-repository.interface.js";
import {
  IPostModel,
  PostModel,
} from "../../../frameworks/database/mongoDb/models/post.model.js";
import { IPostEntity } from "../../../entities/models/post.entity.js";

@injectable()
export class PostRepository
  extends BaseRepository<IPostModel>
  implements IPostRepository
{
  constructor() {
    super(PostModel);
  }

  async findAllPosts(
    filter: Partial<IPostEntity>,
    skip: number,
    limit: number,
    userId?: string
  ): Promise<{ items: IPostEntity[]; total: number }> {
    const matchStage = {
      $match: {
        ...(filter.barberId ? { barberId: filter.barberId } : {}),
      },
    };

    const aggregationPipeline: any[] = [
      matchStage,
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: "barbers",
          localField: "barberId",
          foreignField: "userId",
          as: "barberDetails",
        },
      },

      {
        $lookup: {
          from: "comments",
          localField: "postId",
          foreignField: "postId",
          as: "commentsList",
        },
      },

      {
        $addFields: {
          userDetails: {
            $cond: [
              { $gt: [{ $size: "$barberDetails" }, 0] },
              {
                fullName: { $arrayElemAt: ["$barberDetails.shopName", 0] },
                avatar: { $arrayElemAt: ["$barberDetails.avatar", 0] },
              },
              null,
            ],
          },
          likesCount: {
            $size: { $ifNull: ["$likes", []] },
          },
          totalComments: {
            $size: { $ifNull: ["$commentsList", []] },
          },
          isLiked: {
            $cond: [
              { $in: [userId, { $ifNull: ["$likes", []] }] },
              true,
              false,
            ],
          },
        },
      },

      {
        $project: {
          barberDetails: 0,
          commentsList: 0,
          likes: 0,
        },
      },
    ];

    const [items, total] = await Promise.all([
      PostModel.aggregate(aggregationPipeline),
      PostModel.countDocuments(filter),
    ]);

    return { items, total };
  }

  async getSinglePostByPostId(
    filter: Partial<IPostEntity>,
    userId?: string
  ): Promise<IPostEntity | null> {
    const aggregationPipeline: any[] = [
      { $match: filter },

      {
        $lookup: {
          from: "barbers",
          localField: "barberId",
          foreignField: "userId",
          as: "barberDetails",
        },
      },
      {
        $addFields: {
          userDetails: {
            $cond: [
              { $gt: [{ $size: "$barberDetails" }, 0] },
              {
                fullName: { $arrayElemAt: ["$barberDetails.shopName", 0] },
                avatar: { $arrayElemAt: ["$barberDetails.avatar", 0] },
              },
              null,
            ],
          },
        },
      },

      {
        $lookup: {
          from: "comments",
          localField: "postId",
          foreignField: "postId",
          as: "comments",
        },
      },

      {
        $unwind: {
          path: "$comments",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "comments.userId",
          foreignField: "userId",
          as: "clientCommentUser",
        },
      },
      {
        $lookup: {
          from: "barbers",
          localField: "comments.userId",
          foreignField: "userId",
          as: "barberCommentUser",
        },
      },
      {
        $addFields: {
          "comments.userDetails": {
            $cond: [
              { $gt: [{ $size: "$clientCommentUser" }, 0] },
              {
                fullName: { $arrayElemAt: ["$clientCommentUser.fullName", 0] },
                avatar: { $arrayElemAt: ["$clientCommentUser.avatar", 0] },
              },
              {
                $cond: [
                  { $gt: [{ $size: "$barberCommentUser" }, 0] },
                  {
                    fullName: {
                      $arrayElemAt: ["$barberCommentUser.shopName", 0],
                    },
                    avatar: { $arrayElemAt: ["$barberCommentUser.avatar", 0] },
                  },
                  null,
                ],
              },
            ],
          },
          "comments.isCommentLiked": {
            $cond: [
              { $in: [userId, { $ifNull: ["$comments.likes", []] }] },
              true,
              false,
            ],
          },
          "comments.likesCount": {
            $size: {
              $ifNull: ["$comments.likes", []],
            },
          },
        },
      },

      {
        $group: {
          _id: "$postId",
          postId: { $first: "$postId" },
          caption: { $first: "$caption" },
          description: { $first: "$description" },
          image: { $first: "$image" },
          barberId: { $first: "$barberId" },
          userDetails: { $first: "$userDetails" },
          status: { $first: "$status" },
          likes: { $first: "$likes" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          comments: {
            $push: {
              $cond: [
                { $ifNull: ["$comments.commentId", false] },
                "$comments",
                "$$REMOVE",
              ],
            },
          },
        },
      },
      {
        $addFields: {
          comments: {
            $cond: [{ $eq: [{ $size: "$comments" }, 0] }, [], "$comments"],
          },
          isLiked: {
            $cond: [
              { $in: [userId, { $ifNull: ["$likes", []] }] },
              true,
              false,
            ],
          },
        },
      },

      { $limit: 1 },
    ];

    const result = await PostModel.aggregate(aggregationPipeline);
    return result[0] || null;
  }

  async addLike({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }): Promise<IPostEntity | null> {
    return await PostModel.findOneAndUpdate(
      { postId },
      { $addToSet: { likes: userId } },
      { new: true }
    );
  }

  async removeLike({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }): Promise<IPostEntity | null> {
    return await PostModel.findOneAndUpdate(
      { postId },
      { $pull: { likes: userId } },
      { new: true }
    );
  }
}
