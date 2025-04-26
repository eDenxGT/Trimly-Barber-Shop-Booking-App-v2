import { Socket, Server } from "socket.io";
import { inject, injectable } from "tsyringe";
import { DIRECT_CHAT_EVENTS } from "../../../shared/constants.js";
import socketLogger from "../../../shared/utils/socket.logger.js";

@injectable()
export class DirectChatSocketHandler {
  private socket!: Socket;
  private io!: Server;

  constructor() // @inject("ISendDirectChatMessageUseCase")
  // private sendMessageUseCase: ISendDirectChatMessageUseCase
  {}

  setSocket(socket: Socket, io: Server) {
    this.socket = socket;
    this.io = io;
  }

  handleSendMessage = async (data: any) => {
    try {
      console.log(data);
      socketLogger.info("Message sent", { socketId: this.socket.id });

        // const result = await this.sendMessageUseCase.execute(data);

      const result = {};
      this.io
        .to(data.receiverId)
        .emit(DIRECT_CHAT_EVENTS.RECEIVE_MESSAGE, result);

      this.socket.emit(DIRECT_CHAT_EVENTS.RECEIVE_MESSAGE, result);
    } catch (err: any) {
      this.socket.emit("error", { message: err.message });
    }
  };
}
