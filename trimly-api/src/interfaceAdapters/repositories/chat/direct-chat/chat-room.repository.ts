import { injectable } from "tsyringe";
import { IChatRoomRepository } from "../../../../entities/repositoryInterfaces/chat/direct-chat/chat-room-repository.interface.js";
import { BaseRepository } from "../../base.repository.js";
import {
  ChatRoomModel,
  IChatRoomModel,
} from "../../../../frameworks/database/mongoDb/models/chat/chat-room.model.js";
import { IChatRoomEntity } from "../../../../entities/models/chat/chat-room.entity.js";
import { CommunityModel } from "../../../../frameworks/database/mongoDb/models/chat/community-chat-room.model.js";
import { ICommunityChatRoomEntity } from "../../../../entities/models/chat/community-chat-room.entity.js";

@injectable()
export class ChatRoomRepository
  extends BaseRepository<IChatRoomModel>
  implements IChatRoomRepository
{
  constructor() {
    super(ChatRoomModel);
  }

  async getChatRoomByChatId(
    chatId: string,
    role: "client" | "barber"
  ): Promise<IChatRoomEntity | null> {
    const otherRole = role === "client" ? "barber" : "client";
    const participantCollection =
      otherRole === "barber" ? "barbers" : "clients";

    const chat = await ChatRoomModel.aggregate([
      { $match: { chatRoomId: chatId } },

      {
        $lookup: {
          from: participantCollection,
          localField: `${otherRole}Id`,
          foreignField: "userId",
          as: "participantUser",
        },
      },
      { $unwind: "$participantUser" },

      {
        $lookup: {
          from: "directmessages",
          localField: "chatRoomId",
          foreignField: "chatRoomId",
          as: "messages",
        },
      },

      {
        $addFields: {
          messages: {
            $sortArray: {
              input: "$messages",
              sortBy: { timestamp: 1 },
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          chatRoomId: 1,
          participant: {
            userId: "$participantUser.userId",
            name: {
              $ifNull: [
                "$participantUser.fullName",
                "$participantUser.shopName",
              ],
            },
            profileImageUrl: "$participantUser.avatar",
            role: otherRole,
          },
          messages: {
            $map: {
              input: "$messages",
              as: "msg",
              in: {
                messageId: "$$msg.messageId",
                chatRoomId: "$$msg.chatRoomId",
                senderId: "$$msg.senderId",
                receiverId: "$$msg.receiverId",
                messageType: "$$msg.messageType",
                content: "$$msg.content",
                mediaUrl: "$$msg.mediaUrl",
                timestamp: "$$msg.timestamp",
                status: "$$msg.status",
              },
            },
          },
        },
      },
    ]);

    return chat[0] || null;
  }

  async getChatRoomByUserId(
    currentUserId: string,
    opponentUserId: string,
    currentUserRole: "client" | "barber"
  ): Promise<IChatRoomEntity | null> {
    const matchQuery =
      currentUserRole === "client"
        ? { clientId: currentUserId, barberId: opponentUserId }
        : { clientId: opponentUserId, barberId: currentUserId };

    const otherRole = currentUserRole === "client" ? "barber" : "client";
    const participantCollection =
      otherRole === "barber" ? "barbers" : "clients";

    const chat = await ChatRoomModel.aggregate([
      { $match: matchQuery },

      {
        $lookup: {
          from: participantCollection,
          localField: `${otherRole}Id`,
          foreignField: "userId",
          as: "participantUser",
        },
      },
      { $unwind: "$participantUser" },

      {
        $lookup: {
          from: "directmessages",
          localField: "chatRoomId",
          foreignField: "chatRoomId",
          as: "messages",
        },
      },

      {
        $addFields: {
          messages: {
            $sortArray: {
              input: "$messages",
              sortBy: { timestamp: 1 },
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          chatRoomId: 1,
          participant: {
            userId: "$participantUser.userId",
            name: {
              $ifNull: [
                "$participantUser.fullName",
                "$participantUser.shopName",
              ],
            },
            profileImageUrl: "$participantUser.avatar",
            role: otherRole,
          },
          messages: {
            $map: {
              input: "$messages",
              as: "msg",
              in: {
                messageId: "$$msg.messageId",
                chatRoomId: "$$msg.chatRoomId",
                senderId: "$$msg.senderId",
                receiverId: "$$msg.receiverId",
                messageType: "$$msg.messageType",
                content: "$$msg.content",
                mediaUrl: "$$msg.mediaUrl",
                timestamp: "$$msg.timestamp",
                status: "$$msg.status",
              },
            },
          },
        },
      },
    ]);

    return chat[0] || null;
  }

  async getAllChatsByUserId(
    userId: string,
    userRole: "client" | "barber"
  ): Promise<IChatRoomEntity[]> {
    const matchField = userRole === "client" ? "clientId" : "barberId";
    const otherRole = userRole === "client" ? "barber" : "client";
    const participantCollection =
      otherRole === "barber" ? "barbers" : "clients";

    const chats = await ChatRoomModel.aggregate([
      {
        $match: {
          [matchField]: userId,
        },
      },
      {
        $lookup: {
          from: participantCollection,
          localField: `${otherRole}Id`,
          foreignField: "userId",
          as: "participantUser",
        },
      },
      { $unwind: "$participantUser" },

      {
        $lookup: {
          from: "directmessages",
          let: { roomId: "$chatRoomId", userId: userId },
          pipeline: [
            { $match: { $expr: { $eq: ["$chatRoomId", "$$roomId"] } } },
            { $sort: { timestamp: -1 } },
            { $limit: 1 },
          ],
          as: "lastMessage",
        },
      },
      {
        $lookup: {
          from: "directmessages",
          let: { roomId: "$chatRoomId", userId: userId },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$chatRoomId", "$$roomId"] },
                    { $eq: ["$receiverId", "$$userId"] },
                    { $eq: ["$status", "sent"] },
                  ],
                },
              },
            },
          ],
          as: "unreadMessages",
        },
      },

      {
        $project: {
          _id: 0,
          chatRoomId: 1,
          user: {
            userId: "$participantUser.userId",
            name: {
              $ifNull: [
                "$participantUser.fullName",
                "$participantUser.shopName",
              ],
            },
            profileImageUrl: "$participantUser.avatar",
            role: otherRole,
          },
          lastMessage: {
            $cond: [
              { $gt: [{ $size: "$lastMessage" }, 0] },
              {
                content: { $arrayElemAt: ["$lastMessage.content", 0] },
                mediaUrl: { $arrayElemAt: ["$lastMessage.mediaUrl", 0] },
                messageType: { $arrayElemAt: ["$lastMessage.messageType", 0] },
                timestamp: { $arrayElemAt: ["$lastMessage.timestamp", 0] },
                senderId: { $arrayElemAt: ["$lastMessage.senderId", 0] },
              },
              {
                content: null,
                mediaUrl: null,
                messageType: "text",
                timestamp: null,
                senderId: null,
              },
            ],
          },
          unreadCount: { $size: "$unreadMessages" },
        },
      },
      { $sort: { "lastMessage.timestamp": -1 } },
    ]);

    return chats;
  }

}
