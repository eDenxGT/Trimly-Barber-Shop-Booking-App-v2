import { injectable } from "tsyringe";
import { IChatRoomRepository } from "../../../entities/repositoryInterfaces/chat/chat-room-repository.interface.js";
import { BaseRepository } from "../base.repository.js";
import {
  ChatRoomModel,
  IChatRoomModel,
} from "./../../../frameworks/database/mongoDb/models/chat/chat-room.model.js";
import { IChatRoomEntity } from "../../../entities/models/chat/chat-room.entity.js";

@injectable()
export class ChatRoomRepository
  extends BaseRepository<IChatRoomModel>
  implements IChatRoomRepository
{
  constructor() {
    super(ChatRoomModel);
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
}
