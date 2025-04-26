import { Server, Socket } from "socket.io";
import { container } from "tsyringe";
import { DIRECT_CHAT_EVENTS } from "../../../shared/constants.js";
import { directChatSocketHandler } from "../../../frameworks/di/resolver.js";
import { IDirectChatSocketHandler } from "../../../entities/socketHandlerInterfaces/direct-chat-handler.interface.js";

export class DirectChatEvents {
  private handler: IDirectChatSocketHandler;

  constructor(private socket: Socket, private io: Server) {
    this.handler = directChatSocketHandler;
    this.handler.setSocket(this.socket, this.io);
  }

  register() {
    this.socket.on(
      DIRECT_CHAT_EVENTS.SEND_MESSAGE,
      this.handler.handleSendMessage
    );
  }
}
