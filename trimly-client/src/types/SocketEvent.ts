import { INotification } from "./Notification";

export interface ServerToClientEvents {
  "direct-chat:receive-message": (data: any) => void;
  "receive-notification": (notification: INotification) => void;
  "community-chat:receive-message": (data: any) => void;
  "direct-chat:read-message": (data: any) => void;
  "direct-chat:mark-as-read": (data: any) => void;
}

export interface ClientToServerEvents {
  "direct-chat:send-message": (data: any) => void;
  "community-chat:send-message": (data: any) => void;
  registerUser: (data: { userId: string }) => void;
  "direct-chat:read-message": (data: any) => void;
}
