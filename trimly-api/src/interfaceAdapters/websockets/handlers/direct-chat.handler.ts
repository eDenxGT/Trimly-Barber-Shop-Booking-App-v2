import { Socket, Server } from "socket.io";
import { inject, injectable } from "tsyringe";
import { DIRECT_CHAT_EVENTS } from "../../../shared/constants.js";
import socketLogger from "../../../shared/utils/socket.logger.js";
import { ISendDirectMessageUseCase } from "../../../entities/useCaseInterfaces/chat/direct-chat/send-direct-messsage-usecase.interface.js";
import { SocketUserStore } from "../socket-user.store.js";

@injectable()
export class DirectChatSocketHandler {
  private socket!: Socket;
  private io!: Server;
  private socketUserStore = SocketUserStore.getInstance();

  constructor(
    @inject("ISendDirectMessageUseCase")
    private _sendDirectMessageUseCase: ISendDirectMessageUseCase
  ) {}

  setSocket(socket: Socket, io: Server) {
    this.socket = socket;
    this.io = io;
  }

  handleSendMessage = async (data: any) => {
    try {
      console.log(data);
      socketLogger.info("Message sent", { socketId: this.socket.id });
      console.log(this.socket.data.userId);

      const receiverSocketId = this.socketUserStore.getSocketId(
        data.receiverId
      );

      const result = await this._sendDirectMessageUseCase.execute(data);

      if (receiverSocketId) {
        this.io
          .to(receiverSocketId)
          .emit(DIRECT_CHAT_EVENTS.RECEIVE_MESSAGE, result);
      }

      // this.socket.emit(DIRECT_CHAT_EVENTS.RECEIVE_MESSAGE, result);
    } catch (err: any) {
      this.socket.emit("error", { message: err.message });
    }
  };
}
