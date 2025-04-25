export interface IDirectMessageEntity {
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
