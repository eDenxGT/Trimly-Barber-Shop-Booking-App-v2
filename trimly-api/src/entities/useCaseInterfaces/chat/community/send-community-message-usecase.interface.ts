import { ICommunityMessageEntity } from "../../../models/chat/community-message.entity.js";

export interface ISendCommunityMessageUseCase {
  execute(data: Partial<ICommunityMessageEntity>): Promise<ICommunityMessageEntity>;
}
