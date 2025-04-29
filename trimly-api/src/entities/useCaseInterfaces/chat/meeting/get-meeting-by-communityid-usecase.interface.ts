import { IMeetingRoomEntity } from "../../../models/chat/meeting-room.entity.js";

export interface IGetMeetingByCommunityIdUseCase {
	execute(communityId: string): Promise<IMeetingRoomEntity>;
}
