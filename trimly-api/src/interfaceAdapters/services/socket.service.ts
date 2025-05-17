import { Server } from "socket.io";
import { ISocketService } from "../../entities/serviceInterfaces/socket-service.interface.js";

export class SocketService implements ISocketService {
  private static _io: Server;

  public static setIO(io: Server) {
    this._io = io;
  }

  public static getIO(): Server {
    if (!this._io) throw new Error("Socket.io instance not set.");
    return this._io;
  }
}
