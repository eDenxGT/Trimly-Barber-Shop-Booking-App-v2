import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { config } from "../../shared/config.js";
import { DirectChatEvents } from "../../interfaceAdapters/websockets/events/direct-chat.events.js";
import { CommunityChatEvents } from "../../interfaceAdapters/websockets/events/community-chat.events.js";

export class SocketServer {
  private _io: Server;

  constructor(httpServer: HttpServer) {
    this._io = new Server(httpServer, {
      cors: {
        origin: config.cors.ALLOWED_ORIGIN,
      },
    });
  }

  public getIO(): Server {
    return this._io;
  }

  public onConnection(callback: (socket: Socket) => void): void {
    this._io.on("connection", (socket) => {
      callback(socket);

      const directChatEvents = new DirectChatEvents(socket, this._io);
      directChatEvents.register();

      const communityChatEvents = new CommunityChatEvents(socket, this._io);
      communityChatEvents.register();
    });
  }
}
