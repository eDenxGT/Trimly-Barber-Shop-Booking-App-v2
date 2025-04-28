import { Socket, Server } from "socket.io";
import { inject, injectable } from "tsyringe";
import { SocketUserStore } from "../socket-user.store.js";
import { ISendDirectMessageUseCase } from "../../../entities/useCaseInterfaces/chat/direct-chat/send-direct-messsage-usecase.interface.js";
import socketLogger from "../../../shared/utils/socket.logger.js";
import { COMMUNITY_CHAT_EVENTS } from "../../../shared/constants.js";
import { ICommunityChatSocketHandler } from "../../../entities/socketHandlerInterfaces/community-chat-handler.interface.js";

@injectable()
export class CommunityChatSocketHandler implements ICommunityChatSocketHandler {
  private _socket!: Socket;
  private _io!: Server;
  private _socketUserStore = SocketUserStore.getInstance();

  constructor(
    @inject("ISendDirectMessageUseCase")
    private _sendDirectMessageUseCase: ISendDirectMessageUseCase
  ) {}

  setSocket(socket: Socket, io: Server) {
    this._socket = socket;
    this._io = io;
  }

  handleSendMessage = async (data: any) => {
    try {
      console.log(data);
      socketLogger.info("Community Message sent", {
        socketId: this._socket.id,
      });
      console.log(this._socket.data.userId);

      const receiverSocketId = this._socketUserStore.getSocketId(
        data.receiverId
      );

      //   const result = await this._sendDirectMessageUseCase.execute(data);
      const result = data;

      if (receiverSocketId) {
        this._io
          .to(receiverSocketId)
          .emit(COMMUNITY_CHAT_EVENTS.RECEIVE_MESSAGE, result);
      }

      // this._socket.emit(DIRECT_CHAT_EVENTS.RECEIVE_MESSAGE, result);
    } catch (err: any) {
      this._socket.emit("error", { message: err.message });
    }
  };
}
