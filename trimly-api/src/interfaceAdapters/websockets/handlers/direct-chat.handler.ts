import { Socket, Server } from "socket.io";
import { inject, injectable } from "tsyringe";
import { DIRECT_CHAT_EVENTS } from "../../../shared/constants.js";
import socketLogger from "../../../shared/utils/socket.logger.js";
import { ISendDirectMessageUseCase } from "../../../entities/useCaseInterfaces/chat/direct-chat/send-direct-messsage-usecase.interface.js";
import { SocketUserStore } from "../socket-user.store.js";
import { IDirectChatSocketHandler } from "../../../entities/socketHandlerInterfaces/direct-chat-handler.interface.js";
import { IReadDirectMessageUseCase } from "../../../entities/useCaseInterfaces/chat/direct-chat/read-direct-message-usecase.interface.js";

@injectable()
export class DirectChatSocketHandler implements IDirectChatSocketHandler {
  private _socket!: Socket;
  private _io!: Server;
  private _socketUserStore = SocketUserStore.getInstance();

  constructor(
    @inject("ISendDirectMessageUseCase")
    private _sendDirectMessageUseCase: ISendDirectMessageUseCase,
    @inject("IReadDirectMessageUseCase")
    private _readDirectMessageUseCase: IReadDirectMessageUseCase
  ) {}

  setSocket(socket: Socket, io: Server) {
    this._socket = socket;
    this._io = io;
  }

  handleSendMessage = async (data: any) => {
    try {
      console.log(data);
      socketLogger.info("Message sent", {
        socketId: this._socket.id,
        userId: this._socket.data.userId,
      });

      const receiverSocketId = this._socketUserStore.getSocketId(
        data.receiverId
      );

      const result = await this._sendDirectMessageUseCase.execute(data);

      if (receiverSocketId) {
        this._io
          .to(receiverSocketId)
          .emit(DIRECT_CHAT_EVENTS.RECEIVE_MESSAGE, result);
      }

      // this._socket.emit(DIRECT_CHAT_EVENTS.RECEIVE_MESSAGE, result);
    } catch (err: any) {
      this._socket.emit("error", { message: err.message });
    }
  };

  handleReadMessage = async (data: any) => {
    try {
      const userId = this._socket.data.userId;
      socketLogger.info("Message read", {
        socketId: this._socket.id,
        userId,
      });

      const chatRoomId = data.chatRoomId;

      await this._readDirectMessageUseCase.execute({
        chatRoomId,
        userId,
      });

      this._io.emit(DIRECT_CHAT_EVENTS.READ_MESSAGE, {
        chatRoomId,
        success: true,
      });
    } catch (err: any) {
      this._socket.emit("error", { message: err.message });
    }
  };
}
