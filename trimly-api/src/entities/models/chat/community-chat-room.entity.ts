export interface ICommunityChatRoomEntity {
  communityId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  members: string[];
  createdBy: string;
  status: "active" | "blocked";
  createdAt: Date;
  updatedAt: Date;
}
