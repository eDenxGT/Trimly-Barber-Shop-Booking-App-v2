export interface ServerToClientEvents {
  "direct-chat:receive-message": (data: any) => void;
  "receive-notification": (notificationData: { message: string }) => void;
  "community-chat:receive-message": (data: any) => void;
  "direct-chat:read-message": (data: any) => void;
}

export interface ClientToServerEvents {
  "direct-chat:send-message": (data: any) => void;
  "community-chat:send-message": (data: any) => void;
  registerUser: (data: { userId: string }) => void;
  "direct-chat:read-message": (data: any) => void;
}
