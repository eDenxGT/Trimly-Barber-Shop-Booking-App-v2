import { io, Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "@/types/SocketEvent";

const URL = import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:5000";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  {
    withCredentials: true,
    transports: ["websocket"],
  }
);
