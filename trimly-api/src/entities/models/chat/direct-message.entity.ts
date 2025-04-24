export interface IDirectMessage {
    messageId: string;
    chatRoomId: string; 
    senderId: string;
    receiverId: string;  
    messageType: 'text' | 'image' | 'video' | 'audio';
    content: string | null; 
    mediaUrl?: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
  }
  