import { io, Socket } from "socket.io-client";

export interface ServerToClientEvents {
  RECEIVE_MESSAGE: (data: any) => void;
  "receive-notification": (notificationData: { message: string }) => void;
}

export interface ClientToServerEvents {
  SEND_MESSAGE: (data: any) => void;
}

const URL = import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:5000";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  {
    withCredentials: true,
    transports: ["websocket"],
  }
);
