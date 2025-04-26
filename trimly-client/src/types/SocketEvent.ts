export interface ServerToClientEvents {
  "direct-chat:receive-message": (data: any) => void;
  "receive-notification": (notificationData: { message: string }) => void;
}

export interface ClientToServerEvents {
  "direct-chat:send-message": (data: any) => void;
  "community-chat:send-message": (data: any) => void;
  "registerUser": (data: { userId: string }) => void;
}
