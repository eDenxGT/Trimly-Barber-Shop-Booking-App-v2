import { Socket, Server } from "socket.io";

export interface IDirectChatSocketHandler {
  setSocket(socket: Socket, io: Server): void;
  handleSendMessage(data: any): Promise<void>;
  handleReadMessage(data: any): Promise<void>;
}
