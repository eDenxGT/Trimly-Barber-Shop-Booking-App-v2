import { IDirectMessageEntity } from "../../../models/chat/direct-message.entity.js";

export interface ISendDirectMessageUseCase {
  execute(data: Partial<IDirectMessageEntity>): Promise<IDirectMessageEntity>;
}
