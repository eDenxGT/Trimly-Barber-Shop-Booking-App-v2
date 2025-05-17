import { Server, Socket } from "socket.io";

export interface INotificationSocketHandler {
  handleSendNotificationByUserId(data: any): Promise<void>;
}
