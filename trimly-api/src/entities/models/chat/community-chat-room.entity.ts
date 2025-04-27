export interface ICommunityChatRoomEntity {
  communityId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  members: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
