import { ICommunityChatSocketHandler } from "../../../entities/socketHandlerInterfaces/community-chat-handler.interface.js";
import { communityChatSocketHandler } from "../../../frameworks/di/resolver.js";
import { COMMUNITY_CHAT_EVENTS } from "../../../shared/constants.js";
import { Socket, Server } from "socket.io";

export class CommunityChatEvents {
  private _handler: ICommunityChatSocketHandler;

  constructor(private socket: Socket, private io: Server) {
    this._handler = communityChatSocketHandler;
    this._handler.setSocket(this.socket, this.io);
  }

  register() {
    this.socket.on(
      COMMUNITY_CHAT_EVENTS.SEND_MESSAGE,
      this._handler.handleSendMessage
    );
  }
}
