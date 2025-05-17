import { Socket, Server } from "socket.io";
import { INotificationSocketHandler } from "../../../entities/socketHandlerInterfaces/notification-handler.interface.js";
import { NotificationSocketHandler } from "../handlers/notification.handler.js";

export class NotificationEvents {
  private handler: INotificationSocketHandler;

  constructor(private socket: Socket, private io: Server) {
    this.handler = new NotificationSocketHandler();
  }

  register() {}
}
