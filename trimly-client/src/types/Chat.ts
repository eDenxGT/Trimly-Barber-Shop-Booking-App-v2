import { IBarber } from "./User";

export interface ICommunityChat {
  communityId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  members?: IBarber[];
  activeMembers?: number;
  status: "active" | "blocked";
  membersCount?: number;
  createdBy: {
    userId: string;
    name: string;
    avatar?: string;
  };
  isJoined?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  messages?: ICommunityMessage[];
}

export interface ICommunityMessage {
  messageId: string;
  communityId: string;
  messageType: "text" | "image";
  content: string | null;
  mediaUrl?: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  readBy: string[];
  senderId: string;
  senderName: string;
  senderAvatar: string;
}

// export interface IChat {
//   chatRoomId?: string;
//   clientId: string;
//   barberId: string;
//   messages: IDirectMessage[];
//   createdAt?: Date;
//   updatedAt?: Date;
// }

export interface IUserPreview {
  userId: string;
  name: string;
  profileImageUrl?: string;
  role?: "client" | "barber";
}

// * Direct chat preview
export interface IDirectChatPreview {
  chatRoomId: string;
  user: IUserPreview;
  lastMessage: {
    senderId: string;
    content: string | null;
    mediaUrl?: string;
    messageType: "text" | "image";
    timestamp: Date;
  };
  unreadCount: number;
}

export interface IDirectMessage {
  messageId: string;
  chatRoomId: string;
  senderId: string;
  receiverId: string;
  messageType: "text" | "image";
  content: string | null;
  mediaUrl?: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

export interface IDirectChat {
  chatRoomId: string;
  participant: IUserPreview;
  messages: IDirectMessage[];
}

// * Community chat preview
export interface ICommunityChatPreview extends ICommunityChat {
  membersCount: number;
  lastMessage: {
    senderDetails: IUserPreview;
    content: string | null;
    mediaUrl?: string;
    messageType: "text" | "image";
    timestamp: Date;
  };
}

export interface IMeetingRoom {
  meetingId: string;
  title: string;
  description?: string;
  communityId: string;
  scheduledBy: string;
  startTime: Date;
  endTime: Date;
  meetLink: string;
  communityDetails?: {
    name: string;
    imageUrl: string;
  };
  status: "scheduled" | "cancelled" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
}
