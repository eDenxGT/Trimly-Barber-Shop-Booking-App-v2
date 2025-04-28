import { Socket, Server } from "socket.io";

export interface ICommunityChatSocketHandler {
  setSocket(socket: Socket, io: Server): void;
  handleSendMessage(data: any): Promise<void>;
}
